# Verify Report: routing-nested-slugs

**Change**: routing-nested-slugs
**Branch**: feat/nested-routing
**Artifact store**: openspec
**Mode**: Strict TDD (fresh adversarial review)
**Date**: 2026-07-13
**Verdict**: PASS — 0 CRITICAL, 0 WARNING, 2 SUGGESTION

## Executive Summary

Implementation conforms to the spec on every MUST. `pnpm test` = 12/12 green, `pnpm build`
= exactly 49 pages with 44 nested two-segment spokes, 4 single-segment hubs, and `/` from
index.astro. `getPageUrl` is the single source of URL truth and is exercised by all 7 URL
sites in siloLinking.ts plus the router. Built spoke HTML contains nested hrefs and zero flat
spoke URLs. `/api/lead` compiles to a server function and is not shadowed by the rest route.

## Evidence by Check

### 1. Test suite — PASS
- `pnpm test`: 12 pass / 0 fail (5 getPageUrl + 3 siloLinking + 4 lead endpoint).
- Nested spoke assertions ARE present and load-bearing (not just "code runs"):
  - `getPageUrl.test.ts:50` asserts `/construccion-bardas/zona-hotelera`.
  - `siloLinking.test.ts:108` downward hub→spoke asserts `/construccion-bardas/zona-hotelera`.
  - `siloLinking.test.ts:139` lateral asserts `/acabados-finos/centro` (sibling's OWN hub, proves derivation from parentHub not current page).
  - `siloLinking.test.ts:143` lateral asserts `/construccion-bardas/zona-hotelera`.
- Regression assertions still present + green: hub L91 (`/construccion-bardas`),
  parentHub L120 (`/construccion-bardas`), home L125 (`/`).
- Malformed-spoke guard tested twice: missing parentHub (L53) and missing locationSlug (L69),
  both asserting flat `/${id}` fallback.

### 2. Build — PASS
- `pnpm build` succeeded; exactly 49 index.html emitted (verified by count = 49).
- Nested spoke on disk: `.vercel/output/static/construccion-bardas/zona-hotelera/index.html` (16k) exists.
- Home: `.vercel/output/static/index.html` (15k) exists.
- Hub single-segment: `.vercel/output/static/construccion-bardas/index.html` (17k) exists.
- `/api/lead` compiled as server function: `_render.func/chunks/lead_Cv_AiHia.mjs` present.
- Route precedence in config.json (in order): `handle: filesystem` (serves the 49 static
  pages first) → `_astro` → `_server-islands` → `_image` → `^/api/lead/?$` → `^/404/?$` →
  `^/.*$` catch-all. The API route precedes the catch-all and static files are served by the
  filesystem handler. Neither `/` nor `/api/lead` is shadowed by the rest param.

### 3. getPageUrl correctness — PASS
- home (`id === 'index'`) → `/` (L14).
- hub → `/${id}` (L22).
- spoke → `/${parentHub}/${locationSlug}` (L18), derived from parentHub NOT service. Confirmed.
- malformed spoke guard → `/${page.id}` (L19); tested (see check 1).

### 4. siloLinking — PASS
- All 7 URL sites route through getPageUrl: L54 (home→hubs), L72 (hub→spokes), L97
  (parentHub), L104 (home link), L125 (lateral same-loc), L153 (lateral next), L167
  (lateral prev). No leftover inline `/${...id}` string construction in src (only the helper
  itself and its doc comment contain `/${...}`).
- Matching logic (L67-69, L86-89) left untouched as designed.
- Hub/home URLs byte-identical: helper returns `/${id}` for hubs and `/` for home; regression
  tests L91/L120/L125 confirm unchanged output.

### 5. Spec conformance — PASS (every MUST satisfied)
- Spoke URLs nested + derived from parentHub+locationSlug: MET (getPageUrl L18, build dirs).
- No flat single-segment spoke URLs emitted: MET (all 44 spokes are two-segment on disk).
- Hub URLs single-segment: MET (4 hub index.html at one segment).
- Home remains `/`: MET.
- Rest route does not shadow `/` or `/api/lead`: MET (route precedence proof above).
- Silo links single source of truth: MET (all sites via getPageUrl; link URLs === static paths).
- All 4 scenarios in spec (nested spoke, single-segment hub, 49 nested paths, API/index not
  shadowed) verified against actual build output.

### 6. Regression — built HTML nested hrefs — PASS
- Spot-checked `.vercel/output/static/construccion-bardas/zona-hotelera/index.html`:
  - Nested spoke hrefs present: `href="/construccion-bardas/bonfil"`,
    `href="/remodelacion-acabados/zona-hotelera"`.
  - Single-segment upward/home hrefs present: `href="/construccion-bardas"`, `href="/"`.
  - Flat spoke href leak check: none found.

### 7. Orphaned references — PASS (src clean)
- Old `src/pages/[slug].astro` is gone; only `src/pages/[...slug].astro` exists.
- No `[slug]` references in `src/`. Remaining `[slug]` matches are only in openspec docs
  (handoff.md, prior seo-microsite-cancun change, and this change's own artifacts) — expected
  historical/planning text, not code. See SUGGESTION 1.

## Findings

### CRITICAL
None.

### WARNING
None.

### SUGGESTION
1. `openspec/handoff.md` (L12, L23) still describes the router as `[slug].astro` (flat
   catch-all). Non-blocking stale doc; refresh at archive so handoff reflects the nested
   rest-param router.
2. Two dist targets coexist (`dist/client/` from the astro build and `.vercel/output/static/`
   from the vercel adapter). Both show the correct 49-page nested topology. Harmless, but a
   `dist/` cleanup between builds would avoid confusion when inspecting output.

## Artifacts
- openspec/changes/routing-nested-slugs/verify-report.md

## Next Recommended
sdd-archive (clean; no CRITICAL). At archive, merge the spec delta (lock nested / reject flat)
and refresh handoff.md per SUGGESTION 1.
