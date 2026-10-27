import type { APIRoute } from 'astro';
import {
  getAdminPassword,
  getTicketRepository,
} from '../../../modules/tickets/infrastructure/repositoryFactory.ts';
import type { EvidenciaEtapa, MaterialEstado } from '../../../modules/tickets/domain/types.ts';

export const prerender = false;

const ADMIN_COOKIE = 'ebm_admin_session';
const MAESTRO_COOKIE = 'ebm_maestro_pin';

function jsonResponse(payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const repo = getTicketRepository();

  try {
    const body = (await request.json()) as Record<string, any>;
    const action = String(body.action || '');

    switch (action) {
      case 'admin_login': {
        const password = String(body.password || '').trim();
        if (password !== getAdminPassword()) {
          return jsonResponse({ ok: false, error: 'Contraseña de administrador incorrecta.' }, 401);
        }
        cookies.set(ADMIN_COOKIE, 'authenticated', {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });
        return jsonResponse({ ok: true });
      }

      case 'admin_logout': {
        cookies.delete(ADMIN_COOKIE, { path: '/' });
        return jsonResponse({ ok: true });
      }

      case 'maestro_login': {
        const pin = String(body.pin || '').trim();
        const maestro = await repo.getMaestroByPin(pin);
        if (!maestro) {
          return jsonResponse(
            { ok: false, error: 'PIN de maestro albañil no válido. Verifique sus 4 dígitos.' },
            401
          );
        }
        cookies.set(MAESTRO_COOKIE, maestro.pin, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 14,
        });
        return jsonResponse({ ok: true, maestro });
      }

      case 'maestro_logout': {
        cookies.delete(MAESTRO_COOKIE, { path: '/' });
        return jsonResponse({ ok: true });
      }

      case 'create_maestro': {
        if (cookies.get(ADMIN_COOKIE)?.value !== 'authenticated') {
          return jsonResponse({ ok: false, error: 'No autorizado. Inicie sesión como administrador.' }, 403);
        }
        const maestro = await repo.createMaestro({
          nombre: String(body.nombre || ''),
          telefono: String(body.telefono || ''),
          especialidad: String(body.especialidad || ''),
          pin: String(body.pin || ''),
        });
        return jsonResponse({ ok: true, maestro });
      }

      case 'create_ticket': {
        if (cookies.get(ADMIN_COOKIE)?.value !== 'authenticated') {
          return jsonResponse({ ok: false, error: 'No autorizado. Inicie sesión como administrador.' }, 403);
        }
        const ticket = await repo.createTicket({
          clienteNombre: String(body.clienteNombre || ''),
          clienteTelefono: String(body.clienteTelefono || ''),
          zona: String(body.zona || ''),
          direccionReferencia: String(body.direccionReferencia || ''),
          servicioSolicitado: String(body.servicioSolicitado || ''),
          requerimientosCliente: String(body.requerimientosCliente || ''),
          maestroId: body.maestroId ? String(body.maestroId) : null,
          citaFecha: body.citaFecha ? String(body.citaFecha) : null,
          citaNotas: body.citaNotas ? String(body.citaNotas) : null,
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'assign_cita': {
        if (cookies.get(ADMIN_COOKIE)?.value !== 'authenticated') {
          return jsonResponse({ ok: false, error: 'No autorizado. Inicie sesión como administrador.' }, 403);
        }
        const ticket = await repo.assignCita({
          ticketId: String(body.ticketId || ''),
          maestroId: String(body.maestroId || ''),
          citaFecha: String(body.citaFecha || ''),
          citaNotas: body.citaNotas ? String(body.citaNotas) : undefined,
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'submit_presupuesto': {
        const isMaestroOrAdmin =
          cookies.get(ADMIN_COOKIE)?.value === 'authenticated' ||
          Boolean(cookies.get(MAESTRO_COOKIE)?.value);
        if (!isMaestroOrAdmin) {
          return jsonResponse(
            { ok: false, error: 'No autorizado. Inicie sesión con su PIN de maestro albañil.' },
            403
          );
        }
        let fotoUrl = String(body.evidenciaFotoDataUrl || '');
        if (fotoUrl.startsWith('data:image/')) {
          const [meta, base64Data] = fotoUrl.split(',');
          const mimeMatch = meta.match(/data:(.*?);base64/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const buffer = Buffer.from(base64Data, 'base64');
          fotoUrl = await repo.uploadPhoto(buffer, `visita-${body.ticketId}.jpg`, mimeType);
        }

        const ticket = await repo.submitPresupuesto({
          ticketId: String(body.ticketId || ''),
          maestroId: String(body.maestroId || ''),
          presupuestoDetalle: String(body.presupuestoDetalle || ''),
          presupuestoManoObra: Number(body.presupuestoManoObra || 0),
          presupuestoMaterialesEstimado: Number(body.presupuestoMaterialesEstimado || 0),
          presupuestoDiasEstimados: Number(body.presupuestoDiasEstimados || 1),
          evidenciaFotoUrl: fotoUrl,
          evidenciaDescripcion: String(body.evidenciaDescripcion || ''),
          firmaMaestroData: String(body.firmaMaestroData || ''),
          firmaMaestroNombre: String(body.firmaMaestroNombre || ''),
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'sign_cliente': {
        const ticket = await repo.signClientePresupuesto({
          codigo: String(body.codigo || ''),
          firmaClienteNombre: String(body.firmaClienteNombre || ''),
          firmaClienteData: String(body.firmaClienteData || ''),
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'add_evidencia': {
        const isMaestroOrAdmin =
          cookies.get(ADMIN_COOKIE)?.value === 'authenticated' ||
          Boolean(cookies.get(MAESTRO_COOKIE)?.value);
        if (!isMaestroOrAdmin) {
          return jsonResponse(
            { ok: false, error: 'No autorizado. Inicie sesión con su PIN de maestro albañil.' },
            403
          );
        }
        let fotoUrl = String(body.fotoDataUrl || '');
        if (fotoUrl.startsWith('data:image/')) {
          const [meta, base64Data] = fotoUrl.split(',');
          const mimeMatch = meta.match(/data:(.*?);base64/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const buffer = Buffer.from(base64Data, 'base64');
          fotoUrl = await repo.uploadPhoto(buffer, `avance-${body.ticketId}.jpg`, mimeType);
        }

        const porcentajeAvance = Number(body.porcentajeAvance ?? 0);
        const etapa: EvidenciaEtapa = porcentajeAvance >= 100 ? 'cierre_obra' : 'avance_obra';

        const ticket = await repo.addEvidenciaAvance({
          ticketId: String(body.ticketId || ''),
          autorRol: body.autorRol === 'admin' ? 'admin' : 'maestro',
          autorNombre: String(body.autorNombre || 'Maestro Albañil'),
          etapa,
          descripcion: String(body.descripcion || ''),
          fotoUrl,
          porcentajeAvance,
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'add_material': {
        const isMaestroOrAdmin =
          cookies.get(ADMIN_COOKIE)?.value === 'authenticated' ||
          Boolean(cookies.get(MAESTRO_COOKIE)?.value);
        if (!isMaestroOrAdmin) {
          return jsonResponse(
            { ok: false, error: 'No autorizado. Inicie sesión con su PIN de maestro albañil.' },
            403
          );
        }
        let comprobanteUrl: string | null = body.comprobanteDataUrl
          ? String(body.comprobanteDataUrl)
          : null;

        if (comprobanteUrl && comprobanteUrl.startsWith('data:image/')) {
          const [meta, base64Data] = comprobanteUrl.split(',');
          const mimeMatch = meta.match(/data:(.*?);base64/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const buffer = Buffer.from(base64Data, 'base64');
          comprobanteUrl = await repo.uploadPhoto(buffer, `material-${body.ticketId}.jpg`, mimeType);
        }

        const ticket = await repo.addMaterial({
          ticketId: String(body.ticketId || ''),
          concepto: String(body.concepto || ''),
          cantidad: String(body.cantidad || ''),
          costoEstimado: Number(body.costoEstimado || 0),
          costoReal: body.costoReal ? Number(body.costoReal) : null,
          estado: (body.estado as MaterialEstado) || 'pendiente_compra',
          comprobanteUrl,
          notas: body.notas ? String(body.notas) : null,
        });
        return jsonResponse({ ok: true, ticket });
      }

      case 'update_material_estado': {
        const isMaestroOrAdmin =
          cookies.get(ADMIN_COOKIE)?.value === 'authenticated' ||
          Boolean(cookies.get(MAESTRO_COOKIE)?.value);
        if (!isMaestroOrAdmin) {
          return jsonResponse(
            { ok: false, error: 'No autorizado. Inicie sesión con su PIN de maestro albañil.' },
            403
          );
        }
        const ticket = await repo.updateMaterialEstado(
          String(body.materialId || ''),
          (body.estado as MaterialEstado) || 'comprado',
          body.costoReal !== undefined && body.costoReal !== '' ? Number(body.costoReal) : null
        );
        return jsonResponse({ ok: true, ticket });
      }

      default:
        return jsonResponse({ ok: false, error: `Acción desconocida: ${action}` }, 400);
    }
  } catch (err: any) {
    return jsonResponse(
      { ok: false, error: err?.message || 'Error inesperado al procesar la solicitud.' },
      400
    );
  }
};
