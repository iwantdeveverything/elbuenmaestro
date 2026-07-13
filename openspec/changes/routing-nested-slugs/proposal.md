# Proposal: Nested Hub/Location Slug Routing

## Intent

The published SEO spec (`openspec/specs/seo-microsite-structure/`) mandates a nested silo
structure where spokes live under their hub (`/[hub]/[location-slug]`), but the code emits
FLAT single-segment URLs (`/bardas-zona-hotelera`). This contradiction is tracked by GitHub
issue #4. Flat spoke URLs weaken topical clustering and misrepresent the hub-spoke hierarchy
to crawlers. This change rewires routing to nested URLs and reconciles the spec so nested is
locked and flat is explicitly rejected.

## Scope

### In Scope
- Convert spoke URLs to nested `/${parentHub}/${locationSlug}`; keep hub URLs single-segment.
- Introduce a shared `getPageUrl()` helper as the single source of URL truth.
- Update the router and the 4 spoke-URL sites in `siloLinking.ts`.
- Add spoke nested-URL test assertions (current coverage gap).
- Reconcile `seo-microsite-structure` spec to lock nested + reject flat. Closes issue #4.

### Out of Scope
- Content regeneration or file moves (frontmatter already sufficient; generator untouched).
- 301 redirect map — site is PRE-LAUNCH, clean swap, no legacy URLs to preserve.
- Sitemap integration (none exists today).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `seo-microsite-structure`: lock nested `/[hub]/[location-slug]` URL rule; declare flat
  single-segment spoke URLs non-conformant.

## Approach

Approach 1 from exploration: rest-param router + shared helper. Rename
`src/pages/[slug].astro` → `[...slug].astro`. Add `getPageUrl(page)`: hub → `/${page.id}`,
spoke → `/${page.data.parentHub}/${page.data.locationSlug}`. Reuse it in `getStaticPaths`
(`params.slug = getPageUrl(page).slice(1)`) and all `siloLinking.ts` URL sites. Zero content
edits, zero generator changes. Derive URLs from `parentHub` (always = hub id), never `service`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/[slug].astro` | Modified/Renamed | → `[...slug].astro`; emit nested params via helper |
| `src/utils/getPageUrl.ts` | New | Single URL-derivation helper |
| `src/utils/siloLinking.ts` | Modified | 4 spoke sites use helper; hub/home stay |
| `src/utils/siloLinking.test.ts` | Modified | Add spoke nested-URL assertions |
| `openspec/specs/seo-microsite-structure/` | Modified | Lock nested, reject flat |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Rest-param shadows `index.astro` / `/api/lead` | Low | Astro resolves more-specific first; confirm at build |
| URL derived from `service` not `parentHub` | Med | Helper uses `parentHub` exclusively (= hub id for all 44 spokes) |
| Silent spoke-URL regression | Med | Add nested assertions before merge |

## Rollback Plan

Single-commit revert: restore `[slug].astro`, drop `getPageUrl.ts`, revert `siloLinking.ts`
and spec. No data/content migration to unwind (pre-launch, no redirects).

## Dependencies

- None (frontmatter `parentHub` + `locationSlug` already present on all 44 spokes).

## Success Criteria

- [ ] All 49 pages build; spokes emit nested URLs, hub URLs unchanged.
- [ ] Silo links point to nested spoke URLs; hub/home links unchanged.
- [ ] Tests green, including new spoke nested-URL assertions.
- [ ] `seo-microsite-structure` spec reconciled; issue #4 closed.
