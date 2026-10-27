import type {
  AssignCitaInput,
  CreateTicketInput,
  SignClientePresupuestoInput,
  SubmitPresupuestoInput,
  TicketObra,
  TicketStatus,
} from './types.ts';

export interface StatusStepMeta {
  status: TicketStatus;
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
}

export const TICKET_STATUS_STEPS: StatusStepMeta[] = [
  {
    status: 'solicitud_creada',
    stepNumber: 1,
    label: 'Solicitud Registrada',
    shortLabel: '1. Solicitud',
    description: 'Requerimientos del cliente registrados. Pendiente asignar maestro y horario de visita.',
    badgeColor: '#64748b',
  },
  {
    status: 'cita_asignada',
    stepNumber: 2,
    label: 'Cita de Levantamiento Asignada',
    shortLabel: '2. Cita Asignada',
    description: 'Maestro albañil asignado para visitar la obra, tomar medidas y levantar evidencia.',
    badgeColor: '#3b82f6',
  },
  {
    status: 'presupuesto_enviado',
    stepNumber: 3,
    label: 'Presupuesto y Evidencia Listos',
    shortLabel: '3. Presupuesto',
    description: 'Visita realizada con fotos de evidencia y cotización desglosada. Pendiente firma del cliente.',
    badgeColor: '#f59e0b',
  },
  {
    status: 'presupuesto_firmado',
    stepNumber: 4,
    label: 'Acuerdo Firmado (Maestro + Cliente)',
    shortLabel: '4. Firmado',
    description: 'Ambas partes firmaron de conformidad el presupuesto. Listo para arrancar obra y materiales.',
    badgeColor: '#8b5cf6',
  },
  {
    status: 'en_obra',
    stepNumber: 5,
    label: 'Obra en Ejecución',
    shortLabel: '5. En Obra',
    description: 'Trabajo en curso con bitácora de evidencias fotográficas y control de materiales.',
    badgeColor: '#06b6d4',
  },
  {
    status: 'finalizado',
    stepNumber: 6,
    label: 'Obra Finalizada',
    shortLabel: '6. Finalizado',
    description: 'Trabajo concluido al 100% con evidencia fotográfica de entrega.',
    badgeColor: '#10b981',
  },
];

export function getStatusMeta(status: TicketStatus): StatusStepMeta {
  if (status === 'cancelado') {
    return {
      status: 'cancelado',
      stepNumber: 0,
      label: 'Ticket Cancelado',
      shortLabel: 'Cancelado',
      description: 'Este ticket fue cancelado.',
      badgeColor: '#ef4444',
    };
  }
  return TICKET_STATUS_STEPS.find((s) => s.status === status) ?? TICKET_STATUS_STEPS[0];
}

export function generateTicketCode(seedDate: Date = new Date(), randomSuffix?: string): string {
  const year = seedDate.getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = randomSuffix || '';
  if (!suffix) {
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return `EBM-${year}-${suffix.toUpperCase()}`;
}

export function determineInitialTicketStatus(input: CreateTicketInput): TicketStatus {
  if (input.maestroId && input.citaFecha && input.citaFecha.trim().length > 0) {
    return 'cita_asignada';
  }
  return 'solicitud_creada';
}

export function validateAssignCita(input: AssignCitaInput): void {
  if (!input.maestroId || input.maestroId.trim().length === 0) {
    throw new Error('Debe seleccionar un maestro albañil para asignar la cita.');
  }
  if (!input.citaFecha || input.citaFecha.trim().length === 0) {
    throw new Error('Debe indicar la fecha y hora de la cita con el cliente.');
  }
}

export function validateSubmitPresupuesto(ticket: TicketObra, input: SubmitPresupuestoInput): void {
  if (ticket.estado === 'cancelado' || ticket.estado === 'finalizado') {
    throw new Error(`No se puede cargar presupuesto en un ticket con estado ${ticket.estado}.`);
  }
  if (!input.presupuestoDetalle || input.presupuestoDetalle.trim().length < 10) {
    throw new Error('El alcance y detalle del presupuesto debe tener al menos 10 caracteres.');
  }
  if (!Number.isFinite(input.presupuestoManoObra) || input.presupuestoManoObra <= 0) {
    throw new Error('El monto de mano de obra debe ser mayor a $0.');
  }
  if (!Number.isFinite(input.presupuestoMaterialesEstimado) || input.presupuestoMaterialesEstimado < 0) {
    throw new Error('El monto estimado de materiales no puede ser negativo.');
  }
  if (!Number.isFinite(input.presupuestoDiasEstimados) || input.presupuestoDiasEstimados <= 0) {
    throw new Error('Los días estimados de ejecución deben ser al menos 1 día.');
  }
  if (!input.evidenciaFotoUrl || input.evidenciaFotoUrl.trim().length === 0) {
    throw new Error('Es obligatorio adjuntar foto de evidencia de la visita para enviar el presupuesto.');
  }
  if (!input.firmaMaestroData || !input.firmaMaestroData.startsWith('data:image/')) {
    throw new Error('Es obligatoria la firma digital del maestro albañil en el presupuesto.');
  }
}

export function validateClienteSignature(ticket: TicketObra, input: SignClientePresupuestoInput): void {
  if (ticket.estado !== 'presupuesto_enviado') {
    throw new Error('El ticket debe tener un presupuesto enviado por el maestro antes de poder firmarse.');
  }
  if (!ticket.firmaMaestroData) {
    throw new Error('Falta la firma del maestro albañil en el presupuesto.');
  }
  if (!input.firmaClienteNombre || input.firmaClienteNombre.trim().length < 2) {
    throw new Error('Por favor ingrese su nombre completo para respaldar su firma.');
  }
  if (!input.firmaClienteData || !input.firmaClienteData.startsWith('data:image/')) {
    throw new Error('Por favor dibuje su firma en el recuadro antes de confirmar.');
  }
}

export function computeNextStatusOnAvance(currentStatus: TicketStatus, porcentajeAvance: number): TicketStatus {
  if (currentStatus === 'solicitud_creada' || currentStatus === 'cita_asignada' || currentStatus === 'presupuesto_enviado') {
    throw new Error('El presupuesto debe estar firmado por el cliente y el maestro antes de registrar avances de obra.');
  }
  if (porcentajeAvance >= 100) {
    return 'finalizado';
  }
  return 'en_obra';
}
