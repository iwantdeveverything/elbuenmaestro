-- Seed data for El Buen Maestro (Local Supabase & Testing)

-- 1. Maestros Albaniles
insert into public.maestros (id, nombre, telefono, especialidad, pin, activo)
values
  ('11111111-1111-1111-1111-111111111111', 'Maestro Roberto Cauich', '529981112233', 'Bardas, Estructuras y Obra Gris', '1024', true),
  ('22222222-2222-2222-2222-222222222222', 'Maestro Miguel Pech', '529984445566', 'Pisos, Azulejos y Acabados Finos', '2048', true)
on conflict (id) do nothing;

-- 2. Sample Tickets
-- Ticket 1: EBM-2026-CANC (presupuesto_enviado, pending client signature)
insert into public.tickets (
  id,
  codigo,
  estado,
  cliente_nombre,
  cliente_telefono,
  zona,
  direccion_referencia,
  servicio_solicitado,
  requerimientos_cliente,
  maestro_id,
  cita_fecha,
  cita_notas,
  presupuesto_detalle,
  presupuesto_mano_obra,
  presupuesto_materiales_estimado,
  presupuesto_dias_estimados,
  presupuesto_fecha,
  firma_maestro_data,
  firma_maestro_nombre,
  firma_maestro_fecha,
  porcentaje_avance
) values (
  '33333333-3333-3333-3333-333333333333',
  'EBM-2026-CANC',
  'presupuesto_enviado',
  'Lic. Mariana Villanueva',
  '529982345678',
  'Residencial Cumbres',
  'Calle Monte Albán Mz 14 Lote 8 (Portón gris)',
  'Construcción de Bardas',
  'Necesito levantar barda perimetral trasera de 15 metros lineales a 2.80m de altura con cadena de cerramiento y acabado repellado.',
  '11111111-1111-1111-1111-111111111111',
  '2026-10-27 09:30',
  'Cliente confirma acceso en caseta de vigilancia.',
  'Incluye excavación de zanja para cimentación, desplante con cadena armada, levantamiento de 42m² de muro de block de 15cm, 5 castillos ahogados, cadena de cerramiento superior y repellado fino interior.',
  19500.00,
  14800.00,
  9,
  now(),
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120"><rect width="360" height="120" fill="white"/><text x="20" y="60" fill="black">Firma Maestro Roberto</text></svg>',
  'Maestro Roberto Cauich',
  now(),
  0
) on conflict (codigo) do nothing;

-- Ticket 2: EBM-2026-OBRA (en_obra, 60% progress)
insert into public.tickets (
  id,
  codigo,
  estado,
  cliente_nombre,
  cliente_telefono,
  zona,
  direccion_referencia,
  servicio_solicitado,
  requerimientos_cliente,
  maestro_id,
  cita_fecha,
  cita_notas,
  presupuesto_detalle,
  presupuesto_mano_obra,
  presupuesto_materiales_estimado,
  presupuesto_dias_estimados,
  presupuesto_fecha,
  firma_maestro_data,
  firma_maestro_nombre,
  firma_maestro_fecha,
  firma_cliente_data,
  firma_cliente_nombre,
  firma_cliente_fecha,
  porcentaje_avance
) values (
  '44444444-4444-4444-4444-444444444444',
  'EBM-2026-OBRA',
  'en_obra',
  'Ing. Jorge Alcocer',
  '529987654321',
  'Jardines del Sur',
  'Privada Flamboyanes Casa 42',
  'Pisos y Azulejos',
  'Nivelación de terraza y colocación de 38m² de piso cerámico antiderrapante formato 60x60 con boquilla impermeable.',
  '22222222-2222-2222-2222-222222222222',
  '2026-10-25 11:00',
  'Revisar desnivel hacia coladera pluvial.',
  'Escarificado de firme existente, renivelación con mortero y pendiente del 1.5% a drenaje, colocación de 38m² de porcelanato rectificado con adhesivo crest y emboquillado antihongos.',
  13300.00,
  4900.00,
  5,
  now(),
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120"><rect width="360" height="120" fill="white"/><text x="20" y="60" fill="black">Firma Maestro Miguel</text></svg>',
  'Maestro Miguel Pech',
  now(),
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120"><rect width="360" height="120" fill="white"/><text x="20" y="60" fill="blue">Firma Cliente Jorge</text></svg>',
  'Jorge Alcocer',
  now(),
  60
) on conflict (codigo) do nothing;

-- 3. Evidencias
insert into public.ticket_evidencias (ticket_id, etapa, autor_rol, autor_nombre, descripcion, foto_url, porcentaje_avance)
values
  ('33333333-3333-3333-3333-333333333333', 'visita_relevamiento', 'maestro', 'Maestro Roberto Cauich', 'Visita realizada en sitio. Se midieron 15.20m lineales de lindero posterior.', 'https://placehold.co/600x400/13171e/f59e0b?text=Levantamiento+en+Sitio', 0),
  ('44444444-4444-4444-4444-444444444444', 'visita_relevamiento', 'maestro', 'Maestro Miguel Pech', 'Relevamiento inicial de los 38m² de terraza.', 'https://placehold.co/600x400/13171e/f59e0b?text=Relevamiento+Terraza', 0),
  ('44444444-4444-4444-4444-444444444444', 'avance_obra', 'maestro', 'Maestro Miguel Pech', 'Firme nivelado y 23m² de piso colocado con crucetas niveladoras.', 'https://placehold.co/600x400/13171e/10b981?text=Avance+60%25', 60);

-- 4. Materiales
insert into public.ticket_materiales (ticket_id, concepto, cantidad, costo_estimado, costo_real, estado, notas)
values
  ('33333333-3333-3333-3333-333333333333', 'Block hueco de concreto 15x20x40 cm', '560 piezas', 7280.00, null, 'pendiente_compra', 'Para entrega en planta baja al iniciar obra'),
  ('33333333-3333-3333-3333-333333333333', 'Cemento gris Tolteca + Mortero + Armex 15x20', '22 bultos + 10 tramos', 7520.00, null, 'pendiente_compra', 'Comprar una vez firmado el presupuesto'),
  ('44444444-4444-4444-4444-444444444444', 'Pegazulejo reforzado + Crucetas autonivelantes', '14 sacos + 3 bolsas', 4900.00, 4780.00, 'comprado', 'Comprado en Boxito Cancún - Nota #49182');
