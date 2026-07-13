# Tasks: Nested Hub/Location Slug Routing

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150-250 (incl. tests) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

Rationale: No content/schema/generator edits (0 content lines). One new helper (~15 LOC), one new test file (~40 LOC), one test-file edit (~10 LOC), one `siloLinking.ts` refactor (7 call sites, net small), one router rename with a one-line `getStaticPaths` change. Well under the 400-line budget; single reviewable PR.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Nested routing via shared helper (all tasks) | PR 1 | Base: `main`. Includes helper, router rename, silo refactor, tests, build verification. |

## Phase 1: Helper (RED → GREEN)

- [x] 1.1 RED: Create `src/utils/getPageUrl.test.ts` with failing `node --test` cases: home (`id === 'index'`) → `'/'`; hub → `/${id}`; spoke (`parentHub` + `locationSlug`) → `/${parentHub}/${locationSlug}`; malformed spoke (missing `parentHub`/`locationSlug`) → flat `/${id}` fallback.
- [x] 1.2 GREEN: Create `src/utils/getPageUrl.ts` per design Helper Contract (import `SiloPageEntry` type from `./siloLinking.ts`); run `pnpm test` → 1.1 passes.

## Phase 2: Silo Linking Refactor (RED → GREEN)

- [x] 2.1 RED: Add failing spoke nested-URL assertions to `src/utils/siloLinking.test.ts`: hub downward `result.spokes[0].url === '/construccion-bardas/zona-hotelera'`; spoke lateral `result.laterals.some((l) => l.url === '/acabados-finos/centro')`.
- [x] 2.2 GREEN: Refactor `src/utils/siloLinking.ts` — import `getPageUrl`, route all 7 URL sites (L52, L72, L95, L102, L123, L151, L165) through `getPageUrl(page)`/`getPageUrl(entry)`; leave matching logic (L67-68, L86-87) untouched; run `pnpm test` → 2.1 plus existing L91/L117/L122 regression assertions stay green.

## Phase 3: Router Rename (Integration)

- [x] 3.1 Rename `src/pages/[slug].astro` → `src/pages/[...slug].astro`; in `getStaticPaths` set `params.slug = getPageUrl(page).slice(1)`; keep `index` filter (L12) and props (`{ page }`) unchanged; body unchanged.

## Phase 4: Build Verification

- [x] 4.1 Run `pnpm build`; assert exactly 49 pages emit; 44 spokes as two-segment nested dirs in `dist/`; 4 hubs single-segment; `/` served from `index.astro`; `/api/lead` endpoint intact (not shadowed).
- [x] 4.2 Run full `pnpm test`; all suites green (helper + silo + regressions).

## Phase 5: Spec Reconciliation (note)

- [x] 5.1 Note: `openspec/specs/seo-microsite-structure/` delta merge (lock nested, reject flat) is applied at archive, not here. No edit in this change beyond the existing delta under `changes/routing-nested-slugs/specs/`.
