Objective: Build integrated ticket assignment, quote approval with digital signatures, and construction progress/materials tracking platform inside `elbuenmaestro`.
Branch: feat/ticket-tracking-platform | Delivery strategy: single-pr (exception-ok, 3 work-unit commits on single feature branch)
Test runner: node --experimental-strip-types --test

## Specs

- **S1**: "quiero desarrollar una plataforma para asignar un ticket al cliente, y a partir de ahì el cliente puede dar seguimiento a su obra con evidencias, primero para hacer la cita, osea el cliente quiere tal y tal ok? entonces yo con esos requerimientos que tomo por whatsapp busco a un maestro albañil que pueda lanzarse a tomar requerimientos, entonces ahi pasamos a otro estado en la plataforma"
  - Scope: Ticket creation (`solicitud_creada`) and appointment assignment (`cita_asignada`) to a specific Maestro Albañil.
  - Checks: `node --experimental-strip-types --test src/modules/tickets/domain/ticketStateMachine.test.ts`

- **S2**: "ya cuando se levanta el presupuesto y se toma evidencia, yo puedo ver tambien como va, y asi el cliente y el maestro firman de que se concreto el trabajo y ahi empieza el trabajo y a partir de ahi el albañil puede subir evidencias de su trabajo del material a comprar etc."
  - Scope: State transitions for `presupuesto_enviado` (requires site visit photo + Maestro digital signature), `presupuesto_firmado` (requires Client digital signature), `en_obra` (work progress photos + materials list/receipts), and `finalizado` (100% completion).
  - Checks: `node --experimental-strip-types --test src/modules/tickets/domain/ticketStateMachine.test.ts`

- **S3**: "si, necesito integrar esto en este mismo proyecto para poder utilizar el dominio que ya tengo (elbuenmaestrocancun.com) linkeado actualmente en publico"
  - Scope: On-demand SSR routes (`/admin`, `/maestro`, `/ticket`, `/ticket/[codigo]`, `/api/tickets/action`) with `export const prerender = false` inside the existing Astro v5+ `@astrojs/vercel` setup while preserving static prerendering for all 51 SEO pages.
  - Checks: `npm run build`

- **S4**: "ok vamos con supabase" + "excelente" (acceso Admin con clave, Maestro con PIN de 4 dígitos, Cliente con link directo y firma en pantalla)
  - Scope: `supabase/schema.sql`, `SupabaseTicketRepository`, `LocalFallbackTicketRepository`, and frictionless role access (Admin cookie auth, Maestro 4-digit PIN auth, Client direct ticket link with HTML5 Canvas touch signatures).
  - Checks: `npm test && npm run build`

- **S5**: "se puede hacer un seed o algo para probar en local esa conexion de base de datos o algo por el estilo?" + "opcion b"
  - Scope: Local Supabase Docker setup (`supabase/config.toml`, `supabase/migrations/20261027000000_init_tickets.sql`, `supabase/seed.sql`), programmatic seed & connection verifier script (`scripts/seed-supabase.ts` exposed via `npm run db:seed`), and `isRealSupabaseConfigured` support for `http://127.0.0.1` / `http://localhost` local Docker Supabase URLs in `src/modules/tickets/infrastructure/repositoryFactory.ts`.
  - Checks: `npm test`

## Tasks

- [x] **T1** (S1, S2) | route: inline (domain & state machine unit) | status: done | commit: `60e1a3b` | evidence: `src/modules/tickets/domain/ticketStateMachine.test.ts` (7/7 GREEN), Risk: none
- [x] **T2** (S3, S4) | route: inline (Supabase RLS schema & Hexagonal repository adapters) | status: done | commit: `eac4ca1` | evidence: `supabase/schema.sql`, `src/modules/tickets/infrastructure/supabaseRepository.ts`, Risk: item 1 (database schema) & item 5 (added `@supabase/supabase-js` dependency)
- [x] **T3** (S1, S2, S3, S4) | route: inline + independent verifier (`0b3e70c5-619d-4c8b-8cac-dce045336cd0`) | status: done | commit: `29a6375` | evidence: `npm test` (17/17 GREEN), `npm run typecheck` (0 errors), `npm run build` (51 static + SSR bundle), verifier `S1-S4 PASS` (0 blockers), Risk: item 2 (cookie/PIN authentication guards on `/api/tickets/action`)
- [x] **T4** (S5) | route: inline (Local Supabase Docker config, migrations, seed SQL, and programmatic `db:seed` verifier) | status: done | commit: `a7c6e0f` | evidence: `npm run db:seed` (verified PostgreSQL + Storage bucket `obras-evidencias` on local Docker Supabase `http://127.0.0.1:54321`), `npm test` (20/20 GREEN including `repositoryFactory.test.ts`), `npm run typecheck` (0 errors), `npm run build` (51 static + SSR bundle), Risk: item 1 (database migration/seed scripts) & item 5 (local Docker Supabase environment config)

## Log

- **L1 (2026-10-27)**: "Si mira, si me caen llamadas y todo, pero sabes que pasa, que tengo dos maestros albañiles que luego no se si realmente tomaron el trabajo y no se si realmente hicieron el negocio osea no hay comunicaciòn clara, entonces, quiero desarrollar una plataforma para asignar un ticket al cliente, y a partir de ahì el cliente puede dar seguimiento a su obra con evidencias, primero para hacer la cita, osea el cliente quiere tal y tal ok? entonces yo con esos requerimientos que tomo por whatsapp busco a un maestro albañil que pueda lanzarse a tomar requerimientos, entonces ahi pasamos a otro estado en la plataforma, ya cuando se levanta el presupuesto y se toma evidencia, yo puedo ver tambien como va, y asi el cliente y el maestro firman de que se concreto el trabajo y ahi empieza el trabajo y a partir de ahi el albañil puede subir evidencias de su trabajo del material a comprar etc."
- **L2 (2026-10-27)**: User confirmed integration in same project: "si, necesito integrar esto en este mismo proyecto para poder utilizar el dominio que ya tengo (elbuenmaestrocancun.com) linkeado actualmente en publico"
- **L3 (2026-10-27)**: User selected Supabase: "ok vamos con supabase"
- **L4 (2026-10-27)**: User approved 6-state machine and frictionless access model (Admin password, Maestro PIN, Client tracking link + touch signatures): "excelente"
- **L5 (2026-10-27)**: User requested strict compliance with full Gentle AI / ODD protocol: "pues necesito que lo hagas si o si todo bajo ese esquema wey, no te puedes saltar nada"
- **L6 (2026-10-27)**: Executed full ODD & Gentle AI harness: refreshed `.atl/skill-registry.md` (8 skills, saved to Engram `id: 15`), synced CodeGraph index, enforced Language Domain Contract (`ZERO_VOSEO_MATCHES` in UI files), ran `odd-independent-verifier` (`0b3e70c5-619d-4c8b-8cac-dce045336cd0`) with isolated `/tmp` probe (`S1-S4 PASS`, 0 blockers), hardened Maestro mutation endpoints (`ebm_maestro_pin` server-side cookie check) + Supabase RLS (`ENABLE ROW LEVEL SECURITY`), committed lifecycle probe into `ticketStateMachine.test.ts` (17/17 tests passing), and removed `/tmp/odd-verify-s8Zbtt` scratch dir.
- **L7 (2026-10-27)**: User chose single feature branch strategy: "en una sola rama de feature". Created branch `feat/ticket-tracking-platform` and recorded work-unit commits (`60e1a3b`, `eac4ca1`, and `29a6375`).
- **L8 (2026-10-27)**: User asked: "se puede hacer un seed o algo para probar en local esa conexion de base de datos o algo por el estilo?" and selected "opcion b" (local Supabase in Docker + seed). Added S5 and T4 before first write.
