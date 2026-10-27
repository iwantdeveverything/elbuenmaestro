export type TicketStatus =
  | 'solicitud_creada'
  | 'cita_asignada'
  | 'presupuesto_enviado'
  | 'presupuesto_firmado'
  | 'en_obra'
  | 'finalizado'
  | 'cancelado';

export type EvidenciaEtapa = 'visita_relevamiento' | 'avance_obra' | 'cierre_obra';

export type AutorRol = 'admin' | 'maestro' | 'cliente';

export type MaterialEstado = 'pendiente_compra' | 'comprado' | 'entregado_en_obra';

export interface MaestroAlbanil {
  id: string;
  nombre: string;
  telefono: string;
  especialidad: string;
  pin: string;
  activo: boolean;
  createdAt: string;
}

export interface TicketEvidencia {
  id: string;
  ticketId: string;
  etapa: EvidenciaEtapa;
  autorRol: AutorRol;
  autorNombre: string;
  descripcion: string;
  fotoUrl: string;
  porcentajeAvance: number | null;
  createdAt: string;
}

export interface TicketMaterial {
  id: string;
  ticketId: string;
  concepto: string;
  cantidad: string;
  costoEstimado: number;
  costoReal: number | null;
  estado: MaterialEstado;
  comprobanteUrl: string | null;
  notas: string | null;
  createdAt: string;
}

export interface TicketObra {
  id: string;
  codigo: string;
  estado: TicketStatus;
  clienteNombre: string;
  clienteTelefono: string;
  zona: string;
  direccionReferencia: string;
  servicioSolicitado: string;
  requerimientosCliente: string;
  maestroId: string | null;
  maestro?: MaestroAlbanil | null;
  citaFecha: string | null;
  citaNotas: string | null;
  presupuestoDetalle: string | null;
  presupuestoManoObra: number | null;
  presupuestoMaterialesEstimado: number | null;
  presupuestoDiasEstimados: number | null;
  presupuestoFecha: string | null;
  firmaMaestroData: string | null;
  firmaMaestroNombre: string | null;
  firmaMaestroFecha: string | null;
  firmaClienteData: string | null;
  firmaClienteNombre: string | null;
  firmaClienteFecha: string | null;
  porcentajeAvance: number;
  createdAt: string;
  updatedAt: string;
  evidencias: TicketEvidencia[];
  materiales: TicketMaterial[];
}

export interface CreateTicketInput {
  clienteNombre: string;
  clienteTelefono: string;
  zona: string;
  direccionReferencia?: string;
  servicioSolicitado: string;
  requerimientosCliente: string;
  maestroId?: string | null;
  citaFecha?: string | null;
  citaNotas?: string | null;
}

export interface AssignCitaInput {
  ticketId: string;
  maestroId: string;
  citaFecha: string;
  citaNotas?: string;
}

export interface SubmitPresupuestoInput {
  ticketId: string;
  maestroId: string;
  presupuestoDetalle: string;
  presupuestoManoObra: number;
  presupuestoMaterialesEstimado: number;
  presupuestoDiasEstimados: number;
  evidenciaFotoUrl: string;
  evidenciaDescripcion: string;
  firmaMaestroData: string;
  firmaMaestroNombre: string;
}

export interface SignClientePresupuestoInput {
  codigo: string;
  firmaClienteData: string;
  firmaClienteNombre: string;
}

export interface AddEvidenciaAvanceInput {
  ticketId: string;
  autorRol: AutorRol;
  autorNombre: string;
  etapa: EvidenciaEtapa;
  descripcion: string;
  fotoUrl: string;
  porcentajeAvance: number;
}

export interface AddMaterialInput {
  ticketId: string;
  concepto: string;
  cantidad: string;
  costoEstimado: number;
  costoReal?: number | null;
  estado: MaterialEstado;
  comprobanteUrl?: string | null;
  notas?: string | null;
}

export interface CreateMaestroInput {
  nombre: string;
  telefono: string;
  especialidad: string;
  pin: string;
}

export interface TicketRepository {
  readonly mode: 'supabase' | 'local-fallback';
  listMaestros(): Promise<MaestroAlbanil[]>;
  getMaestroByPin(pin: string): Promise<MaestroAlbanil | null>;
  createMaestro(input: CreateMaestroInput): Promise<MaestroAlbanil>;
  listTickets(filters?: { maestroId?: string; estado?: TicketStatus }): Promise<TicketObra[]>;
  getTicketByCodigo(codigo: string): Promise<TicketObra | null>;
  getTicketById(id: string): Promise<TicketObra | null>;
  createTicket(input: CreateTicketInput): Promise<TicketObra>;
  assignCita(input: AssignCitaInput): Promise<TicketObra>;
  submitPresupuesto(input: SubmitPresupuestoInput): Promise<TicketObra>;
  signClientePresupuesto(input: SignClientePresupuestoInput): Promise<TicketObra>;
  addEvidenciaAvance(input: AddEvidenciaAvanceInput): Promise<TicketObra>;
  addMaterial(input: AddMaterialInput): Promise<TicketObra>;
  updateMaterialEstado(materialId: string, estado: MaterialEstado, costoReal?: number | null): Promise<TicketObra>;
   uploadPhoto(fileBuffer: Uint8Array, fileName: string, mimeType: string): Promise<string>;
}
