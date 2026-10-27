import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeNextStatusOnAvance,
  determineInitialTicketStatus,
  generateTicketCode,
  validateAssignCita,
  validateClienteSignature,
  validateSubmitPresupuesto,
} from './ticketStateMachine.ts';
import { LocalFallbackTicketRepository } from '../infrastructure/localFallbackRepository.ts';
import type { TicketObra } from './types.ts';

function buildDummyTicket(overrides: Partial<TicketObra> = {}): TicketObra {
  return {
    id: 't-1',
    codigo: 'EBM-2026-TEST',
    estado: 'cita_asignada',
    clienteNombre: 'Carlos Méndez',
    clienteTelefono: '529981234567',
    zona: 'Residencial Cumbres',
    direccionReferencia: 'Av. Huayacán Km 4',
    servicioSolicitado: 'Construcción de Bardas',
    requerimientosCliente: 'Levantar barda perimetral de 18 metros lineales a 2.60m de altura.',
    maestroId: 'm-1',
    citaFecha: '2026-10-28 10:00',
    citaNotas: 'Llevar cinta métrica láser',
    presupuestoDetalle: null,
    presupuestoManoObra: null,
    presupuestoMaterialesEstimado: null,
    presupuestoDiasEstimados: null,
    presupuestoFecha: null,
    firmaMaestroData: null,
    firmaMaestroNombre: null,
    firmaMaestroFecha: null,
    firmaClienteData: null,
    firmaClienteNombre: null,
    firmaClienteFecha: null,
    porcentajeAvance: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evidencias: [],
    materiales: [],
    ...overrides,
  };
}

describe('Ticket State Machine & Domain Rules', () => {
  it('generates formatted ticket codes with EBM-YYYY-XXXX pattern', () => {
    const code = generateTicketCode(new Date('2026-05-10T12:00:00Z'), 'ab92');
    assert.equal(code, 'EBM-2026-AB92');
  });

  it('determines initial status as cita_asignada when maestro and citaFecha are provided', () => {
    assert.equal(
      determineInitialTicketStatus({
        clienteNombre: 'Ana',
        clienteTelefono: '9981002000',
        zona: 'Centro',
        servicioSolicitado: 'Pisos',
        requerimientosCliente: 'Colocar piso cerámico 40m2',
        maestroId: 'm-1',
        citaFecha: '2026-10-29 09:00',
      }),
      'cita_asignada'
    );

    assert.equal(
      determineInitialTicketStatus({
        clienteNombre: 'Ana',
        clienteTelefono: '9981002000',
        zona: 'Centro',
        servicioSolicitado: 'Pisos',
        requerimientosCliente: 'Colocar piso cerámico 40m2',
      }),
      'solicitud_creada'
    );
  });

  it('rejects cita assignment without maestro or date', () => {
    assert.throws(() =>
      validateAssignCita({ ticketId: 't-1', maestroId: '', citaFecha: '2026-10-29' })
    );
    assert.throws(() =>
      validateAssignCita({ ticketId: 't-1', maestroId: 'm-1', citaFecha: '' })
    );
  });

  it('enforces photo evidence and maestro digital signature when submitting presupuesto', () => {
    const ticket = buildDummyTicket();
    assert.throws(() =>
      validateSubmitPresupuesto(ticket, {
        ticketId: 't-1',
        maestroId: 'm-1',
        presupuestoDetalle: 'Cimentación, cadenas de desplante y muro de block de 15cm.',
        presupuestoManoObra: 18500,
        presupuestoMaterialesEstimado: 14200,
        presupuestoDiasEstimados: 10,
        evidenciaFotoUrl: '',
        evidenciaDescripcion: 'Foto del terreno',
        firmaMaestroData: 'data:image/png;base64,iVBORw0KGgo=',
        firmaMaestroNombre: 'Maestro Roberto Cauich',
      })
    );

    assert.throws(() =>
      validateSubmitPresupuesto(ticket, {
        ticketId: 't-1',
        maestroId: 'm-1',
        presupuestoDetalle: 'Cimentación, cadenas de desplante y muro de block de 15cm.',
        presupuestoManoObra: 18500,
        presupuestoMaterialesEstimado: 14200,
        presupuestoDiasEstimados: 10,
        evidenciaFotoUrl: 'https://example.com/visita.jpg',
        evidenciaDescripcion: 'Foto del terreno',
        firmaMaestroData: '',
        firmaMaestroNombre: 'Maestro Roberto Cauich',
      })
    );
  });

  it('requires both maestro signature and presupuesto_enviado status before client can sign', () => {
    const unsignedTicket = buildDummyTicket({ estado: 'cita_asignada' });
    assert.throws(() =>
      validateClienteSignature(unsignedTicket, {
        codigo: 'EBM-2026-TEST',
        firmaClienteNombre: 'Carlos Méndez',
        firmaClienteData: 'data:image/png;base64,iVBORw0KGgo=',
      })
    );

    const readyTicket = buildDummyTicket({
      estado: 'presupuesto_enviado',
      firmaMaestroData: 'data:image/png;base64,iVBORw0KGgo=',
    });
    assert.doesNotThrow(() =>
      validateClienteSignature(readyTicket, {
        codigo: 'EBM-2026-TEST',
        firmaClienteNombre: 'Carlos Méndez',
        firmaClienteData: 'data:image/png;base64,iVBORw0KGgo=',
      })
    );
  });

  it('transitions from presupuesto_firmado to en_obra and then finalizado at 100%', () => {
    assert.throws(() => computeNextStatusOnAvance('presupuesto_enviado', 25));
    assert.equal(computeNextStatusOnAvance('presupuesto_firmado', 30), 'en_obra');
    assert.equal(computeNextStatusOnAvance('en_obra', 75), 'en_obra');
    assert.equal(computeNextStatusOnAvance('en_obra', 100), 'finalizado');
  });

  it('executes full 6-state ticket lifecycle through repository adapter with evidence and dual signatures', async () => {
    const repo = new LocalFallbackTicketRepository();
    const maestros = await repo.listMaestros();
    assert.ok(maestros.length >= 2);

    const created = await repo.createTicket({
      clienteNombre: 'Arq. Fernando Solís',
      clienteTelefono: '9985556677',
      zona: 'Puerto Cancún',
      direccionReferencia: 'Torre Sur Lote 4',
      servicioSolicitado: 'Remodelación y Acabados',
      requerimientosCliente: 'Aplicación de pasta fina y recubrimiento en muro de doble altura.',
    });
    assert.equal(created.estado, 'solicitud_creada');

    const withCita = await repo.assignCita({
      ticketId: created.id,
      maestroId: maestros[0].id,
      citaFecha: '2026-10-30 10:00',
      citaNotas: 'Acceso por caseta de proveedores',
    });
    assert.equal(withCita.estado, 'cita_asignada');

    const withPresupuesto = await repo.submitPresupuesto({
      ticketId: created.id,
      maestroId: maestros[0].id,
      presupuestoDetalle: 'Andamiaje, preparación de superficie y aplicación de 45m2 de pasta fina acrílica.',
      presupuestoManoObra: 16000,
      presupuestoMaterialesEstimado: 6500,
      presupuestoDiasEstimados: 6,
      evidenciaFotoUrl: 'data:image/png;base64,iVBORw0KGgo=',
      evidenciaDescripcion: 'Muro medido con distanciómetro láser',
      firmaMaestroData: 'data:image/png;base64,iVBORw0KGgo=',
      firmaMaestroNombre: maestros[0].nombre,
    });
    assert.equal(withPresupuesto.estado, 'presupuesto_enviado');
    assert.equal(withPresupuesto.evidencias.length, 1);

    const signed = await repo.signClientePresupuesto({
      codigo: created.codigo,
      firmaClienteNombre: 'Fernando Solís',
      firmaClienteData: 'data:image/png;base64,iVBORw0KGgo=',
    });
    assert.equal(signed.estado, 'presupuesto_firmado');

    const inProgress = await repo.addEvidenciaAvance({
      ticketId: created.id,
      autorRol: 'maestro',
      autorNombre: maestros[0].nombre,
      etapa: 'avance_obra',
      descripcion: 'Primer tendido de pasta al 50%.',
      fotoUrl: 'data:image/png;base64,iVBORw0KGgo=',
      porcentajeAvance: 50,
    });
    assert.equal(inProgress.estado, 'en_obra');
    assert.equal(inProgress.porcentajeAvance, 50);

    const withMaterial = await repo.addMaterial({
      ticketId: created.id,
      concepto: 'Cubetas de pasta fina + Sellador acrílico',
      cantidad: '6 cubetas',
      costoEstimado: 6500,
      estado: 'comprado',
    });
    assert.equal(withMaterial.materiales.length, 1);

    const finished = await repo.addEvidenciaAvance({
      ticketId: created.id,
      autorRol: 'maestro',
      autorNombre: maestros[0].nombre,
      etapa: 'cierre_obra',
      descripcion: 'Muro terminado al 100% y área limpia.',
      fotoUrl: 'data:image/png;base64,iVBORw0KGgo=',
      porcentajeAvance: 100,
    });
    assert.equal(finished.estado, 'finalizado');
    assert.equal(finished.porcentajeAvance, 100);
  });
});
