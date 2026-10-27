import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  AddEvidenciaAvanceInput,
  AddMaterialInput,
  AssignCitaInput,
  CreateMaestroInput,
  CreateTicketInput,
  MaestroAlbanil,
  MaterialEstado,
  SignClientePresupuestoInput,
  SubmitPresupuestoInput,
  TicketEvidencia,
  TicketMaterial,
  TicketObra,
  TicketRepository,
  TicketStatus,
} from '../domain/types.ts';
import {
  computeNextStatusOnAvance,
  determineInitialTicketStatus,
  generateTicketCode,
  validateAssignCita,
  validateClienteSignature,
  validateSubmitPresupuesto,
} from '../domain/ticketStateMachine.ts';

function mapMaestro(row: any): MaestroAlbanil {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    especialidad: row.especialidad,
    pin: row.pin,
    activo: Boolean(row.activo),
    createdAt: row.created_at,
  };
}

function mapEvidencia(row: any): TicketEvidencia {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    etapa: row.etapa,
    autorRol: row.autor_rol,
    autorNombre: row.autor_nombre,
    descripcion: row.descripcion,
    fotoUrl: row.foto_url,
    porcentajeAvance: row.porcentaje_avance !== null ? Number(row.porcentaje_avance) : null,
    createdAt: row.created_at,
  };
}

function mapMaterial(row: any): TicketMaterial {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    concepto: row.concepto,
    cantidad: row.cantidad,
    costoEstimado: Number(row.costo_estimado ?? 0),
    costoReal: row.costo_real !== null && row.costo_real !== undefined ? Number(row.costo_real) : null,
    estado: row.estado,
    comprobanteUrl: row.comprobante_url ?? null,
    notas: row.notas ?? null,
    createdAt: row.created_at,
  };
}

function mapTicket(row: any): TicketObra {
  const evidencias: TicketEvidencia[] = Array.isArray(row.ticket_evidencias)
    ? row.ticket_evidencias
        .map(mapEvidencia)
        .sort((a: TicketEvidencia, b: TicketEvidencia) => b.createdAt.localeCompare(a.createdAt))
    : [];

  const materiales: TicketMaterial[] = Array.isArray(row.ticket_materiales)
    ? row.ticket_materiales
        .map(mapMaterial)
        .sort((a: TicketMaterial, b: TicketMaterial) => b.createdAt.localeCompare(a.createdAt))
    : [];

  return {
    id: row.id,
    codigo: row.codigo,
    estado: row.estado,
    clienteNombre: row.cliente_nombre,
    clienteTelefono: row.cliente_telefono,
    zona: row.zona,
    direccionReferencia: row.direccion_referencia ?? '',
    servicioSolicitado: row.servicio_solicitado,
    requerimientosCliente: row.requerimientos_cliente,
    maestroId: row.maestro_id ?? null,
    maestro: row.maestros ? mapMaestro(row.maestros) : null,
    citaFecha: row.cita_fecha ?? null,
    citaNotas: row.cita_notas ?? null,
    presupuestoDetalle: row.presupuesto_detalle ?? null,
    presupuestoManoObra:
      row.presupuesto_mano_obra !== null && row.presupuesto_mano_obra !== undefined
        ? Number(row.presupuesto_mano_obra)
        : null,
    presupuestoMaterialesEstimado:
      row.presupuesto_materiales_estimado !== null && row.presupuesto_materiales_estimado !== undefined
        ? Number(row.presupuesto_materiales_estimado)
        : null,
    presupuestoDiasEstimados:
      row.presupuesto_dias_estimados !== null && row.presupuesto_dias_estimados !== undefined
        ? Number(row.presupuesto_dias_estimados)
        : null,
    presupuestoFecha: row.presupuesto_fecha ?? null,
    firmaMaestroData: row.firma_maestro_data ?? null,
    firmaMaestroNombre: row.firma_maestro_nombre ?? null,
    firmaMaestroFecha: row.firma_maestro_fecha ?? null,
    firmaClienteData: row.firma_cliente_data ?? null,
    firmaClienteNombre: row.firma_cliente_nombre ?? null,
    firmaClienteFecha: row.firma_cliente_fecha ?? null,
    porcentajeAvance: Number(row.porcentaje_avance ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    evidencias,
    materiales,
  };
}

const TICKET_SELECT = `
  *,
  maestros (*),
  ticket_evidencias (*),
  ticket_materiales (*)
`;

export class SupabaseTicketRepository implements TicketRepository {
  readonly mode = 'supabase' as const;
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  async listMaestros(): Promise<MaestroAlbanil[]> {
    const { data, error } = await this.client
      .from('maestros')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Error al consultar maestros: ${error.message}`);
    return (data ?? []).map(mapMaestro);
  }

  async getMaestroByPin(pin: string): Promise<MaestroAlbanil | null> {
    const { data, error } = await this.client
      .from('maestros')
      .select('*')
      .eq('activo', true)
      .eq('pin', pin.trim())
      .maybeSingle();

    if (error) throw new Error(`Error al verificar PIN de maestro: ${error.message}`);
    return data ? mapMaestro(data) : null;
  }

  async createMaestro(input: CreateMaestroInput): Promise<MaestroAlbanil> {
    const { data, error } = await this.client
      .from('maestros')
      .insert({
        nombre: input.nombre.trim(),
        telefono: input.telefono.trim(),
        especialidad: input.especialidad.trim() || 'Albañilería General',
        pin: input.pin.trim(),
        activo: true,
      })
      .select('*')
      .single();

    if (error) throw new Error(`No se pudo registrar el maestro: ${error.message}`);
    return mapMaestro(data);
  }

  async listTickets(filters?: { maestroId?: string; estado?: TicketStatus }): Promise<TicketObra[]> {
    let query = this.client
      .from('tickets')
      .select(TICKET_SELECT)
      .order('created_at', { ascending: false });

    if (filters?.maestroId) {
      query = query.eq('maestro_id', filters.maestroId);
    }
    if (filters?.estado) {
      query = query.eq('estado', filters.estado);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error al listar tickets: ${error.message}`);
    return (data ?? []).map(mapTicket);
  }

  async getTicketByCodigo(codigo: string): Promise<TicketObra | null> {
    const { data, error } = await this.client
      .from('tickets')
      .select(TICKET_SELECT)
      .ilike('codigo', codigo.trim())
      .maybeSingle();

    if (error) throw new Error(`Error al buscar ticket por código: ${error.message}`);
    return data ? mapTicket(data) : null;
  }

  async getTicketById(id: string): Promise<TicketObra | null> {
    const { data, error } = await this.client
      .from('tickets')
      .select(TICKET_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Error al buscar ticket por ID: ${error.message}`);
    return data ? mapTicket(data) : null;
  }

  async createTicket(input: CreateTicketInput): Promise<TicketObra> {
    const codigo = generateTicketCode();
    const estado = determineInitialTicketStatus(input);

    const { data, error } = await this.client
      .from('tickets')
      .insert({
        codigo,
        estado,
        cliente_nombre: input.clienteNombre.trim(),
        cliente_telefono: input.clienteTelefono.trim(),
        zona: input.zona.trim(),
        direccion_referencia: (input.direccionReferencia ?? '').trim(),
        servicio_solicitado: input.servicioSolicitado.trim(),
        requerimientos_cliente: input.requerimientosCliente.trim(),
        maestro_id: input.maestroId || null,
        cita_fecha: input.citaFecha || null,
        cita_notas: input.citaNotas || null,
      })
      .select(TICKET_SELECT)
      .single();

    if (error) throw new Error(`No se pudo crear el ticket: ${error.message}`);
    return mapTicket(data);
  }

  async assignCita(input: AssignCitaInput): Promise<TicketObra> {
    validateAssignCita(input);
    const current = await this.getTicketById(input.ticketId);
    if (!current) throw new Error('Ticket no encontrado.');

    const nextEstado = current.estado === 'solicitud_creada' ? 'cita_asignada' : current.estado;

    const { data, error } = await this.client
      .from('tickets')
      .update({
        maestro_id: input.maestroId,
        cita_fecha: input.citaFecha,
        cita_notas: input.citaNotas ?? current.citaNotas,
        estado: nextEstado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.ticketId)
      .select(TICKET_SELECT)
      .single();

    if (error) throw new Error(`No se pudo asignar la cita: ${error.message}`);
    return mapTicket(data);
  }

  async submitPresupuesto(input: SubmitPresupuestoInput): Promise<TicketObra> {
    const current = await this.getTicketById(input.ticketId);
    if (!current) throw new Error('Ticket no encontrado.');

    validateSubmitPresupuesto(current, input);
    const now = new Date().toISOString();

    const { error: evError } = await this.client.from('ticket_evidencias').insert({
      ticket_id: current.id,
      etapa: 'visita_relevamiento',
      autor_rol: 'maestro',
      autor_nombre: input.firmaMaestroNombre.trim(),
      descripcion: input.evidenciaDescripcion.trim() || 'Evidencia fotográfica del levantamiento en sitio.',
      foto_url: input.evidenciaFotoUrl,
      porcentaje_avance: 0,
    });

    if (evError) throw new Error(`Error al registrar evidencia de visita: ${evError.message}`);

    const { data, error } = await this.client
      .from('tickets')
      .update({
        maestro_id: input.maestroId || current.maestroId,
        presupuesto_detalle: input.presupuestoDetalle.trim(),
        presupuesto_mano_obra: input.presupuestoManoObra,
        presupuesto_materiales_estimado: input.presupuestoMaterialesEstimado,
        presupuesto_dias_estimados: input.presupuestoDiasEstimados,
        presupuesto_fecha: now,
        firma_maestro_data: input.firmaMaestroData,
        firma_maestro_nombre: input.firmaMaestroNombre.trim(),
        firma_maestro_fecha: now,
        estado: 'presupuesto_enviado',
        updated_at: now,
      })
      .eq('id', current.id)
      .select(TICKET_SELECT)
      .single();

    if (error) throw new Error(`Error al guardar el presupuesto: ${error.message}`);
    return mapTicket(data);
  }

  async signClientePresupuesto(input: SignClientePresupuestoInput): Promise<TicketObra> {
    const current = await this.getTicketByCodigo(input.codigo);
    if (!current) throw new Error('Ticket no encontrado.');

    validateClienteSignature(current, input);
    const now = new Date().toISOString();

    const { data, error } = await this.client
      .from('tickets')
      .update({
        firma_cliente_data: input.firmaClienteData,
        firma_cliente_nombre: input.firmaClienteNombre.trim(),
        firma_cliente_fecha: now,
        estado: 'presupuesto_firmado',
        updated_at: now,
      })
      .eq('id', current.id)
      .select(TICKET_SELECT)
      .single();

    if (error) throw new Error(`Error al registrar firma del cliente: ${error.message}`);
    return mapTicket(data);
  }

  async addEvidenciaAvance(input: AddEvidenciaAvanceInput): Promise<TicketObra> {
    const current = await this.getTicketById(input.ticketId);
    if (!current) throw new Error('Ticket no encontrado.');

    const nextStatus = computeNextStatusOnAvance(current.estado, input.porcentajeAvance);
    const nextProgress = Math.max(current.porcentajeAvance, Math.min(100, input.porcentajeAvance));

    const { error: evError } = await this.client.from('ticket_evidencias').insert({
      ticket_id: current.id,
      etapa: input.etapa,
      autor_rol: input.autorRol,
      autor_nombre: input.autorNombre.trim(),
      descripcion: input.descripcion.trim(),
      foto_url: input.fotoUrl,
      porcentaje_avance: input.porcentajeAvance,
    });

    if (evError) throw new Error(`Error al subir evidencia de obra: ${evError.message}`);

    const { data, error } = await this.client
      .from('tickets')
      .update({
        estado: nextStatus,
        porcentaje_avance: nextProgress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id)
      .select(TICKET_SELECT)
      .single();

    if (error) throw new Error(`Error al actualizar avance del ticket: ${error.message}`);
    return mapTicket(data);
  }

  async addMaterial(input: AddMaterialInput): Promise<TicketObra> {
    const { error } = await this.client.from('ticket_materiales').insert({
      ticket_id: input.ticketId,
      concepto: input.concepto.trim(),
      cantidad: input.cantidad.trim(),
      costo_estimado: input.costoEstimado,
      costo_real: input.costoReal ?? null,
      estado: input.estado,
      comprobante_url: input.comprobanteUrl ?? null,
      notas: input.notas?.trim() || null,
    });

    if (error) throw new Error(`Error al registrar material: ${error.message}`);
    const updated = await this.getTicketById(input.ticketId);
    if (!updated) throw new Error('Ticket no encontrado tras agregar material.');
    return updated;
  }

  async updateMaterialEstado(
    materialId: string,
    estado: MaterialEstado,
    costoReal?: number | null
  ): Promise<TicketObra> {
    const updatePayload: Record<string, unknown> = { estado };
    if (costoReal !== undefined && costoReal !== null) {
      updatePayload.costo_real = costoReal;
    }

    const { data, error } = await this.client
      .from('ticket_materiales')
      .update(updatePayload)
      .eq('id', materialId)
      .select('ticket_id')
      .single();

    if (error || !data) throw new Error(`Error al actualizar estado del material: ${error?.message}`);
    const updated = await this.getTicketById(data.ticket_id);
    if (!updated) throw new Error('Ticket no encontrado.');
    return updated;
  }

  async uploadPhoto(fileBuffer: Uint8Array, fileName: string, mimeType: string): Promise<string> {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `evidencias/${Date.now()}-${safeName}`;

    const { error } = await this.client.storage
      .from('obras-evidencias')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      // Fallback to inline base64 data URL if bucket is not yet created
      const base64 = Buffer.from(fileBuffer).toString('base64');
      return `data:${mimeType || 'image/jpeg'};base64,${base64}`;
    }

    const { data } = this.client.storage.from('obras-evidencias').getPublicUrl(storagePath);
    return data.publicUrl;
  }
}
