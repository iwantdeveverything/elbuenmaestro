# Apply Progress: Nested Hub/Location Slug Routing

**Change**: routing-nested-slugs
**Mode**: Strict TDD
**Artifact store**: openspec
**Branch**: feat/nested-routing
**Delivery**: single PR, work-unit commits, `stacked-to-main`

## Status

7/7 tasks complete (5.1 is a no-op note, applied at archive). Ready for verify.

## Completed Tasks

- [x] 1.1 RED: `src/utils/getPageUrl.test.ts` failing cases (home, hub, spoke, malformed guard)
- [x] 1.2 GREEN: `src/utils/getPageUrl.ts` helper per design contract
- [x] 2.1 RED: nested-URL assertions added to `src/utils/siloLinking.test.ts`
- [x] 2.2 GREEN: `src/utils/siloLinking.ts` refactor — all 7 URL sites route through `getPageUrl`
- [x] 3.1 Router rename `[slug].astro` -> `[...slug].astro`; `params.slug = getPageUrl(page).slice(1)`
- [x] 4.1 Build verification: 49 pages, 44 nested spokes, 4 single-segment hubs, `/api/lead` intact
- [x] 4.2 Full `pnpm test` green (12 tests)
- [x] 5.1 Note only — spec delta merge deferred to archive (no edit in this change)

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/utils/getPageUrl.ts` | Created | Helper: home->`/`, hub->`/${id}`, spoke->`/${parentHub}/${locationSlug}` with flat guard |
| `src/utils/getPageUrl.test.ts` | Created | 5 unit tests (home, hub, spoke, 2 malformed-guard cases) |
| `src/utils/siloLinking.ts` | Modified | Import helper; replace all 7 inline `/${id}` URL sites with `getPageUrl(...)` |
| `src/utils/siloLinking.test.ts` | Modified | Added nested-URL assertions (downward spoke + lateral siblings) |
| `src/pages/[slug].astro` -> `src/pages/[...slug].astro` | Renamed (git mv) | Rest-param route; `params.slug = getPageUrl(page).slice(1)`; import helper |
| `package.json` | Modified | Registered `getPageUrl.test.ts` in the `test` script |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1/1.2 | `src/utils/getPageUrl.test.ts` | Unit | N/A (new) | Written (module unresolved, fail confirmed) | 5/5 pass | 5 cases (home/hub/spoke + 2 guards) | Clean |
| 2.1/2.2 | `src/utils/siloLinking.test.ts` | Unit | 3/3 baseline green | Written (`/acabados-finos/centro` assertion failed) | 3/3 pass | Downward + 2 lateral nested assertions | Clean |
| 3.1 | (build integration) | Integration | 7/7 baseline green | N/A structural rename | Build 49 pages | Nested/hub/home path checks | None needed |

## Test Summary

- Total tests: 12 (5 helper + 3 silo + 4 lead endpoint)
- Passing: 12/12
- Layers: Unit (12), Integration (build)
- Approval/regression: existing silo L91/L117/L122 hub+home assertions stayed green through the refactor
- Pure functions created: 1 (`getPageUrl`)

## Build Result

- Pages emitted: 49
- Home: `/` served from `index.astro` (static `dist/client/index.html`)
- Hubs: 4 single-segment (`dist/client/construccion-bardas/index.html`, etc.)
- Spokes: 44 nested two-segment dirs (sample: `dist/client/construccion-bardas/zona-hotelera/index.html`)
- `/api/lead`: server function intact; Vercel `config.json` has explicit `^/api/lead/?$` route before catch-all — not shadowed by the rest param

## Deviations from Design

None functional. Note: with the `@astrojs/vercel` adapter, static HTML is emitted under `dist/client/` (not `dist/`) and the API endpoint compiles into the `_render.func` server function. Design assumed `dist/`; the topology (49 pages, nested spokes, precedence) matches the design exactly.

## Issues Found

None.

## Commits

- `feat(routing): add getPageUrl helper as single source of URL truth`
- `refactor(silo): route all silo link URLs through getPageUrl`
- `feat(routing): serve pages via rest-param route with nested slugs`
