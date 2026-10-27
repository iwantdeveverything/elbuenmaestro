import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
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

interface LocalStoreData {
  maestros: MaestroAlbanil[];
  tickets: TicketObra[];
}

// SVG Data URLs for realistic demo evidence photos and signatures
const DEMO_PHOTO_VISITA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#13171e"/>
      <rect x="24" y="24" width="592" height="352" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 6"/>
      <path d="M80 300 L220 190 L330 270 L440 160 L560 300 Z" fill="#334155"/>
      <circle cx="170" cy="120" r="28" fill="#f59e0b" opacity="0.8"/>
      <text x="320" y="340" text-anchor="middle" fill="#f8fafc" font-family="sans-serif" font-size="18" font-weight="bold">Evidencia en Sitio: Levantamiento y Medidas en Obra</text>
    </svg>`
  );

const DEMO_PHOTO_AVANCE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#0f172a"/>
      <rect x="24" y="24" width="592" height="352" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <g fill="#475569" stroke="#94a3b8" stroke-width="2">
        <rect x="110" y="220" width="100" height="45" rx="3"/>
        <rect x="215" y="220" width="100" height="45" rx="3"/>
        <rect x="320" y="220" width="100" height="45" rx="3"/>
        <rect x="425" y="220" width="100" height="45" rx="3"/>
        <rect x="160" y="170" width="100" height="45" rx="3"/>
        <rect x="265" y="170" width="100" height="45" rx="3"/>
        <rect x="370" y="170" width="100" height="45" rx="3"/>
      </g>
      <text x="320" y="335" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="18" font-weight="bold">Avance de Obra: Desplante de Block y Castillos (60%)</text>
    </svg>`
  );

const DEMO_SIGNATURE_MAESTRO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120" viewBox="0 0 360 120">
      <rect width="360" height="120" fill="#ffffff" rx="8"/>
      <path d="M35 82 Q75 20 110 72 T185 52 Q230 30 265 78 L325 45" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      <text x="180" y="108" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="11">Firma Digital Registrada</text>
    </svg>`
  );

const DEMO_SIGNATURE_CLIENTE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120" viewBox="0 0 360 120">
      <rect width="360" height="120" fill="#ffffff" rx="8"/>
      <path d="M45 75 C85 25, 130 95, 175 45 C215 15, 250 85, 315 55" fill="none" stroke="#1d4ed8" stroke-width="3.5" stroke-linecap="round"/>
      <text x="180" y="108" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="11">Firma Digital del Cliente</text>
    </svg>`
  );

function buildInitialSeed(): LocalStoreData {
  const now = new Date().toISOString();
  const maestro1: MaestroAlbanil = {
    id: 'maestro-roberto-1',
    nombre: 'Maestro Roberto Cauich',
    telefono: '529981112233',
    especialidad: 'Bardas, Estructuras y Obra Gris',
    pin: '1024',
    activo: true,
    createdAt: now,
  };

  const maestro2: MaestroAlbanil = {
    id: 'maestro-miguel-2',
    nombre: 'Maestro Miguel Pech',
    telefono: '529984445566',
    especialidad: 'Pisos, Azulejos y Acabados Finos',
    pin: '2048',
    activo: true,
    createdAt: now,
  };

  const ticket1: TicketObra = {
    id: 'ticket-demo-1',
    codigo: 'EBM-2026-CANC',
    estado: 'presupuesto_enviado',
    clienteNombre: 'Lic. Mariana Villanueva',
    clienteTelefono: '529982345678',
    zona: 'Residencial Cumbres',
    direccionReferencia: 'Calle Monte Albán Mz 14 Lote 8 (Portón gris)',
    servicioSolicitado: 'Construcción de Bardas',
    requerimientosCliente:
      'Necesito levantar barda perimetral trasera de 15 metros lineales a 2.80m de altura con cadena de cerramiento y acabado repellado.',
    maestroId: maestro1.id,
    maestro: maestro1,
    citaFecha: '2026-10-27 09:30',
    citaNotas: 'Cliente confirma acceso en caseta de vigilancia.',
    presupuestoDetalle:
      'Incluye excavación de zanja para cimentación, desplante con cadena armada, levantamiento de 42m² de muro de block de 15cm, 5 castillos ahogados, cadena de cerramiento superior y repellado fino interior.',
    presupuestoManoObra: 19500,
    presupuestoMaterialesEstimado: 14800,
    presupuestoDiasEstimados: 9,
    presupuestoFecha: now,
    firmaMaestroData: DEMO_SIGNATURE_MAESTRO,
    firmaMaestroNombre: maestro1.nombre,
    firmaMaestroFecha: now,
    firmaClienteData: null,
    firmaClienteNombre: null,
    firmaClienteFecha: null,
    porcentajeAvance: 0,
    createdAt: now,
    updatedAt: now,
    evidencias: [
      {
        id: 'ev-demo-1',
        ticketId: 'ticket-demo-1',
        etapa: 'visita_relevamiento',
        autorRol: 'maestro',
        autorNombre: maestro1.nombre,
        descripcion:
          'Visita realizada en sitio. Se midieron 15.20m lineales de lindero posterior y se verificó firmeza del suelo para cimentación.',
        fotoUrl: DEMO_PHOTO_VISITA,
        porcentajeAvance: 0,
        createdAt: now,
      },
    ],
    materiales: [
      {
        id: 'mat-demo-1',
        ticketId: 'ticket-demo-1',
        concepto: 'Block hueco de concreto 15x20x40 cm',
        cantidad: '560 piezas',
        costoEstimado: 7280,
        costoReal: null,
        estado: 'pendiente_compra',
        comprobanteUrl: null,
        notas: 'Para entrega en planta baja al iniciar obra',
        createdAt: now,
      },
      {
        id: 'mat-demo-2',
        ticketId: 'ticket-demo-1',
        concepto: 'Cemento gris Tolteca + Mortero + Armex 15x20',
        cantidad: '22 bultos + 10 tramos Armex',
        costoEstimado: 7520,
        costoReal: null,
        estado: 'pendiente_compra',
        comprobanteUrl: null,
        notas: 'Comprar una vez firmado el presupuesto',
        createdAt: now,
      },
    ],
  };

  const ticket2: TicketObra = {
    id: 'ticket-demo-2',
    codigo: 'EBM-2026-OBRA',
    estado: 'en_obra',
    clienteNombre: 'Ing. Jorge Alcocer',
    clienteTelefono: '529987654321',
    zona: 'Jardines del Sur',
    direccionReferencia: 'Privada Flamboyanes Casa 42',
    servicioSolicitado: 'Pisos y Azulejos',
    requerimientosCliente:
      'Nivelación de terraza y colocación de 38m² de piso cerámico antiderrapante formato 60x60 con boquilla impermeable.',
    maestroId: maestro2.id,
    maestro: maestro2,
    citaFecha: '2026-10-25 11:00',
    citaNotas: 'Revisar desnivel hacia coladera pluvial.',
    presupuestoDetalle:
      'Escarificado de firme existente, renivelación con mortero y pendiente del 1.5% a drenaje, colocación de 38m² de porcelanato rectificado con adhesivo crest y emboquillado antihongos.',
    presupuestoManoObra: 13300,
    presupuestoMaterialesEstimado: 4900,
    presupuestoDiasEstimados: 5,
    presupuestoFecha: now,
    firmaMaestroData: DEMO_SIGNATURE_MAESTRO,
    firmaMaestroNombre: maestro2.nombre,
    firmaMaestroFecha: now,
    firmaClienteData: DEMO_SIGNATURE_CLIENTE,
    firmaClienteNombre: 'Jorge Alcocer',
    firmaClienteFecha: now,
    porcentajeAvance: 60,
    createdAt: now,
    updatedAt: now,
    evidencias: [
      {
        id: 'ev-demo-2',
        ticketId: 'ticket-demo-2',
        etapa: 'visita_relevamiento',
        autorRol: 'maestro',
        autorNombre: maestro2.nombre,
        descripcion: 'Relevamiento inicial de los 38m² de terraza y verificación de niveles.',
        fotoUrl: DEMO_PHOTO_VISITA,
        porcentajeAvance: 0,
        createdAt: now,
      },
      {
        id: 'ev-demo-3',
        ticketId: 'ticket-demo-2',
        etapa: 'avance_obra',
        autorRol: 'maestro',
        autorNombre: maestro2.nombre,
        descripcion:
          'Firme nivelado y 23m² de piso colocado con crucetas niveladoras. Mañana continuamos con cortes perimetrales y zoclo.',
        fotoUrl: DEMO_PHOTO_AVANCE,
        porcentajeAvance: 60,
        createdAt: now,
      },
    ],
    materiales: [
      {
        id: 'mat-demo-3',
        ticketId: 'ticket-demo-2',
        concepto: 'Pegazulejo reforzado + Crucetas autonivelantes + Boquilla',
        cantidad: '14 sacos de 20kg + 3 bolsas crucetas',
        costoEstimado: 4900,
        costoReal: 4780,
        estado: 'comprado',
        comprobanteUrl: DEMO_PHOTO_AVANCE,
        notas: 'Comprado en Boxito Cancún - Nota #49182',
        createdAt: now,
      },
    ],
  };

  return {
    maestros: [maestro1, maestro2],
    tickets: [ticket1, ticket2],
  };
}

let memoryStore: LocalStoreData | null = null;

function getStoreFilePath(): string {
  return path.join(os.tmpdir(), 'elbuenmaestro-tickets-store.json');
}

async function readStore(): Promise<LocalStoreData> {
  if (memoryStore) return memoryStore;
  const filePath = getStoreFilePath();
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    memoryStore = JSON.parse(raw) as LocalStoreData;
    return memoryStore;
  } catch {
    memoryStore = buildInitialSeed();
    try {
      await fs.writeFile(filePath, JSON.stringify(memoryStore, null, 2), 'utf-8');
    } catch {
      // Ignore write errors in read-only environments; memoryStore stays active
    }
    return memoryStore;
  }
}

async function writeStore(data: LocalStoreData): Promise<void> {
  memoryStore = data;
  try {
    await fs.writeFile(getStoreFilePath(), JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Keep in-memory store updated even if tmpdir write fails
  }
}

export class LocalFallbackTicketRepository implements TicketRepository {
  readonly mode = 'local-fallback' as const;

  private hydrateTicket(ticket: TicketObra, maestros: MaestroAlbanil[]): TicketObra {
    const maestro = ticket.maestroId ? maestros.find((m) => m.id === ticket.maestroId) ?? null : null;
    return {
      ...ticket,
      maestro,
    };
  }

  async listMaestros(): Promise<MaestroAlbanil[]> {
    const store = await readStore();
    return store.maestros.filter((m) => m.activo);
  }

  async getMaestroByPin(pin: string): Promise<MaestroAlbanil | null> {
    const store = await readStore();
    const cleanPin = pin.trim();
    return store.maestros.find((m) => m.activo && m.pin === cleanPin) ?? null;
  }

  async createMaestro(input: CreateMaestroInput): Promise<MaestroAlbanil> {
    const store = await readStore();
    if (store.maestros.some((m) => m.pin === input.pin.trim())) {
      throw new Error('Ya existe un maestro albañil con ese PIN de acceso.');
    }
    const nuevo: MaestroAlbanil = {
      id: crypto.randomUUID(),
      nombre: input.nombre.trim(),
      telefono: input.telefono.trim(),
      especialidad: input.especialidad.trim() || 'Albañilería General',
      pin: input.pin.trim(),
      activo: true,
      createdAt: new Date().toISOString(),
    };
    store.maestros.push(nuevo);
    await writeStore(store);
    return nuevo;
  }

  async listTickets(filters?: { maestroId?: string; estado?: TicketStatus }): Promise<TicketObra[]> {
    const store = await readStore();
    let list = store.tickets.map((t) => this.hydrateTicket(t, store.maestros));
    if (filters?.maestroId) {
      list = list.filter((t) => t.maestroId === filters.maestroId);
    }
    if (filters?.estado) {
      list = list.filter((t) => t.estado === filters.estado);
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getTicketByCodigo(codigo: string): Promise<TicketObra | null> {
    const store = await readStore();
    const normalized = codigo.trim().toUpperCase();
    const found = store.tickets.find((t) => t.codigo.toUpperCase() === normalized);
    return found ? this.hydrateTicket(found, store.maestros) : null;
  }

  async getTicketById(id: string): Promise<TicketObra | null> {
    const store = await readStore();
    const found = store.tickets.find((t) => t.id === id);
    return found ? this.hydrateTicket(found, store.maestros) : null;
  }

  async createTicket(input: CreateTicketInput): Promise<TicketObra> {
    const store = await readStore();
    const now = new Date().toISOString();
    let codigo = generateTicketCode();
    while (store.tickets.some((t) => t.codigo === codigo)) {
      codigo = generateTicketCode();
    }

    const estado = determineInitialTicketStatus(input);
    const ticket: TicketObra = {
      id: crypto.randomUUID(),
      codigo,
      estado,
      clienteNombre: input.clienteNombre.trim(),
      clienteTelefono: input.clienteTelefono.trim(),
      zona: input.zona.trim(),
      direccionReferencia: (input.direccionReferencia ?? '').trim(),
      servicioSolicitado: input.servicioSolicitado.trim(),
      requerimientosCliente: input.requerimientosCliente.trim(),
      maestroId: input.maestroId || null,
      citaFecha: input.citaFecha || null,
      citaNotas: input.citaNotas || null,
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
      createdAt: now,
      updatedAt: now,
      evidencias: [],
      materiales: [],
    };

    store.tickets.unshift(ticket);
    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async assignCita(input: AssignCitaInput): Promise<TicketObra> {
    validateAssignCita(input);
    const store = await readStore();
    const ticket = store.tickets.find((t) => t.id === input.ticketId);
    if (!ticket) throw new Error('Ticket no encontrado.');

    ticket.maestroId = input.maestroId;
    ticket.citaFecha = input.citaFecha;
    ticket.citaNotas = input.citaNotas ?? ticket.citaNotas;
    if (ticket.estado === 'solicitud_creada') {
      ticket.estado = 'cita_asignada';
    }
    ticket.updatedAt = new Date().toISOString();
    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async submitPresupuesto(input: SubmitPresupuestoInput): Promise<TicketObra> {
    const store = await readStore();
    const ticket = store.tickets.find((t) => t.id === input.ticketId);
    if (!ticket) throw new Error('Ticket no encontrado.');

    validateSubmitPresupuesto(ticket, input);
    const now = new Date().toISOString();

    ticket.maestroId = input.maestroId || ticket.maestroId;
    ticket.presupuestoDetalle = input.presupuestoDetalle.trim();
    ticket.presupuestoManoObra = input.presupuestoManoObra;
    ticket.presupuestoMaterialesEstimado = input.presupuestoMaterialesEstimado;
    ticket.presupuestoDiasEstimados = input.presupuestoDiasEstimados;
    ticket.presupuestoFecha = now;
    ticket.firmaMaestroData = input.firmaMaestroData;
    ticket.firmaMaestroNombre = input.firmaMaestroNombre.trim();
    ticket.firmaMaestroFecha = now;
    ticket.estado = 'presupuesto_enviado';
    ticket.updatedAt = now;

    ticket.evidencias.unshift({
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      etapa: 'visita_relevamiento',
      autorRol: 'maestro',
      autorNombre: input.firmaMaestroNombre.trim(),
      descripcion: input.evidenciaDescripcion.trim() || 'Evidencia fotográfica del levantamiento en sitio.',
      fotoUrl: input.evidenciaFotoUrl,
      porcentajeAvance: 0,
      createdAt: now,
    });

    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async signClientePresupuesto(input: SignClientePresupuestoInput): Promise<TicketObra> {
    const store = await readStore();
    const normalized = input.codigo.trim().toUpperCase();
    const ticket = store.tickets.find((t) => t.codigo.toUpperCase() === normalized);
    if (!ticket) throw new Error('Ticket no encontrado.');

    validateClienteSignature(ticket, input);
    const now = new Date().toISOString();

    ticket.firmaClienteData = input.firmaClienteData;
    ticket.firmaClienteNombre = input.firmaClienteNombre.trim();
    ticket.firmaClienteFecha = now;
    ticket.estado = 'presupuesto_firmado';
    ticket.updatedAt = now;

    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async addEvidenciaAvance(input: AddEvidenciaAvanceInput): Promise<TicketObra> {
    const store = await readStore();
    const ticket = store.tickets.find((t) => t.id === input.ticketId);
    if (!ticket) throw new Error('Ticket no encontrado.');

    const nextStatus = computeNextStatusOnAvance(ticket.estado, input.porcentajeAvance);
    const now = new Date().toISOString();

    ticket.evidencias.unshift({
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      etapa: input.etapa,
      autorRol: input.autorRol,
      autorNombre: input.autorNombre.trim(),
      descripcion: input.descripcion.trim(),
      fotoUrl: input.fotoUrl,
      porcentajeAvance: input.porcentajeAvance,
      createdAt: now,
    });

    ticket.porcentajeAvance = Math.max(ticket.porcentajeAvance, Math.min(100, input.porcentajeAvance));
    ticket.estado = nextStatus;
    ticket.updatedAt = now;

    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async addMaterial(input: AddMaterialInput): Promise<TicketObra> {
    const store = await readStore();
    const ticket = store.tickets.find((t) => t.id === input.ticketId);
    if (!ticket) throw new Error('Ticket no encontrado.');

    const now = new Date().toISOString();
    ticket.materiales.unshift({
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      concepto: input.concepto.trim(),
      cantidad: input.cantidad.trim(),
      costoEstimado: input.costoEstimado,
      costoReal: input.costoReal ?? null,
      estado: input.estado,
      comprobanteUrl: input.comprobanteUrl ?? null,
      notas: input.notas?.trim() || null,
      createdAt: now,
    });

    ticket.updatedAt = now;
    await writeStore(store);
    return this.hydrateTicket(ticket, store.maestros);
  }

  async updateMaterialEstado(
    materialId: string,
    estado: MaterialEstado,
    costoReal?: number | null
  ): Promise<TicketObra> {
    const store = await readStore();
    for (const ticket of store.tickets) {
      const mat = ticket.materiales.find((m) => m.id === materialId);
      if (mat) {
        mat.estado = estado;
        if (costoReal !== undefined && costoReal !== null) {
          mat.costoReal = costoReal;
        }
        ticket.updatedAt = new Date().toISOString();
        await writeStore(store);
        return this.hydrateTicket(ticket, store.maestros);
      }
    }
    throw new Error('Material no encontrado.');
  }

  async uploadPhoto(fileBuffer: Uint8Array, _fileName: string, mimeType: string): Promise<string> {
    const base64 = Buffer.from(fileBuffer).toString('base64');
    return `data:${mimeType || 'image/jpeg'};base64,${base64}`;
  }
}
