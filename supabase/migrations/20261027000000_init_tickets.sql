-- Supabase Migration for El Buen Maestro - Ticket & Work Tracking Platform

create extension if not exists "pgcrypto";

-- 1. Maestros Albaniles (Builders / Contractors)
create table if not exists public.maestros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  especialidad text not null default 'Albañilería General',
  pin text not null check (char_length(pin) >= 4),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Tickets de Obra (Work Orders / Client Tickets)
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  estado text not null default 'solicitud_creada' check (
    estado in (
      'solicitud_creada',
      'cita_asignada',
      'presupuesto_enviado',
      'presupuesto_firmado',
      'en_obra',
      'finalizado',
      'cancelado'
    )
  ),
  cliente_nombre text not null,
  cliente_telefono text not null,
  zona text not null,
  direccion_referencia text not null default '',
  servicio_solicitado text not null,
  requerimientos_cliente text not null,
  maestro_id uuid references public.maestros(id) on delete set null,
  cita_fecha text,
  cita_notas text,
  presupuesto_detalle text,
  presupuesto_mano_obra numeric(12, 2),
  presupuesto_materiales_estimado numeric(12, 2),
  presupuesto_dias_estimados integer,
  presupuesto_fecha timestamptz,
  firma_maestro_data text,
  firma_maestro_nombre text,
  firma_maestro_fecha timestamptz,
  firma_cliente_data text,
  firma_cliente_nombre text,
  firma_cliente_fecha timestamptz,
  porcentaje_avance integer not null default 0 check (porcentaje_avance >= 0 and porcentaje_avance <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tickets_codigo on public.tickets(codigo);
create index if not exists idx_tickets_maestro_id on public.tickets(maestro_id);
create index if not exists idx_tickets_estado on public.tickets(estado);

-- 3. Evidencias Fotograficas (Site visits, quotes, and work progress photos)
create table if not exists public.ticket_evidencias (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  etapa text not null check (etapa in ('visita_relevamiento', 'avance_obra', 'cierre_obra')),
  autor_rol text not null check (autor_rol in ('admin', 'maestro', 'cliente')),
  autor_nombre text not null,
  descripcion text not null,
  foto_url text not null,
  porcentaje_avance integer check (porcentaje_avance >= 0 and porcentaje_avance <= 100),
  created_at timestamptz not null default now()
);

create index if not exists idx_ticket_evidencias_ticket_id on public.ticket_evidencias(ticket_id);

-- 4. Materiales y Compras (Materials to buy and purchased receipts)
create table if not exists public.ticket_materiales (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  concepto text not null,
  cantidad text not null,
  costo_estimado numeric(12, 2) not null default 0,
  costo_real numeric(12, 2),
  estado text not null default 'pendiente_compra' check (estado in ('pendiente_compra', 'comprado', 'entregado_en_obra')),
  comprobante_url text,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ticket_materiales_ticket_id on public.ticket_materiales(ticket_id);

-- 5. Enable Row-Level Security (Service Role key bypasses RLS on the server; blocks direct anon table mutation)
alter table public.maestros enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_evidencias enable row level security;
alter table public.ticket_materiales enable row level security;

-- 6. Storage Bucket for Evidence Photos
insert into storage.buckets (id, name, public)
values ('obras-evidencias', 'obras-evidencias', true)
on conflict (id) do nothing;
