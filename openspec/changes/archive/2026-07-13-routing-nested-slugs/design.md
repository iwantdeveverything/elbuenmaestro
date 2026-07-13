# Design: Nested Hub/Location Slug Routing

## Technical Approach

Implement Approach 1 (rest-param router + shared helper). A single `getPageUrl(page)`
becomes the sole source of URL truth. The router `[slug].astro` is renamed to
`[...slug].astro` so it can emit multi-segment paths; `getStaticPaths` derives each path
from `getPageUrl`. `siloLinking.ts` replaces its `/${id}` string construction with the
helper. No content, schema, or generator changes. Derivation uses `parentHub` (= hub id on
all 44 spokes), never `service`. Aligns with `seo-microsite-structure` nested URL rule.

## Architecture Decisions

### Decision: Single URL helper vs. inline construction

**Choice**: Centralize in `src/utils/getPageUrl.ts`.
**Alternatives considered**: Keep `/${id}` inline at each site; duplicate logic in router + util.
**Rationale**: URL shape is currently duplicated across 7 sites + router. One helper removes
drift risk and makes the nested rule testable in isolation.

### Decision: Rest param `[...slug]` vs. two route files vs. content folders

**Choice**: Rest param `[...slug].astro`.
**Alternatives considered**: `[hub].astro` + `[hub]/[location].astro` (duplicates Layout/SiloLinks/LeadForm wiring, two `getStaticPaths`); move 44 spokes into `{hub}/{location}.md` folders (heavy git churn, generator rewrite).
**Rationale**: Smallest diff; keeps one route file and one wiring path; frontmatter already sufficient.

### Decision: Route all 7 sites through helper vs. only the 4 spoke sites

**Choice**: Route ALL 7 sites (hub, home, spoke) through `getPageUrl`.
**Alternatives considered**: Touch only the 4 spoke sites, leave hub/home as `/${id}` and `'/'`.
**Rationale**: Consistency and single source of truth. Helper returns `/${id}` for hubs and
`'/'` for home anyway, so hub/home output is byte-identical — no assertion breaks (test L91,
L117, L122 stay green) while eliminating the last inline URL strings.

## Helper Contract

```ts
// src/utils/getPageUrl.ts
import type { SiloPageEntry } from './siloLinking.ts';

export function getPageUrl(page: SiloPageEntry): string {
  if (page.id === 'index') return '/';
  if (page.data.type === 'spoke') {
    const { parentHub, locationSlug } = page.data;
    if (parentHub && locationSlug) return `/${parentHub}/${locationSlug}`;
    return `/${page.id}`; // guard: malformed spoke → flat fallback (no crash)
  }
  return `/${page.id}`; // hub
}
```

Guard rationale: a spoke missing `parentHub`/`locationSlug` is a data defect, not a routing
concern. Falling back to `/${page.id}` keeps the build passing and the page reachable while
surfacing the defect via the added unit test rather than a hard failure.

## Data Flow

```
frontmatter (type, id, parentHub, locationSlug)
        │
        ▼
   getPageUrl(page)  ── single source of URL truth
        │
        ├──→ [...slug].astro getStaticPaths → params.slug = getPageUrl(page).slice(1)
        │        (rest param wants segments w/o leading '/'; 'a/b' → ['a','b'])
        │
        └──→ siloLinking.ts → SiloLink.url (hubs, spokes, parentHub, home, laterals)
                 │
                 ▼
             SiloLinks.astro renders link.url (unchanged)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/utils/getPageUrl.ts` | Create | Helper: home→`/`, hub→`/${id}`, spoke→`/${parentHub}/${locationSlug}` w/ flat guard |
| `src/pages/[slug].astro` | Rename→`[...slug].astro` | `params.slug = getPageUrl(page).slice(1)`; index still filtered (L12); props (`{ page }`) unchanged; body unchanged |
| `src/utils/siloLinking.ts` | Modify | Import `getPageUrl`; replace all 7 URL sites (L52, L72, L95, L102, L123, L151, L165) with `getPageUrl(page)` / `getPageUrl(entry)`; matching logic (L67-68, L86-87) untouched |
| `src/utils/siloLinking.test.ts` | Modify | Add spoke nested-URL assertions |
| `src/utils/getPageUrl.test.ts` | Create | Unit tests for helper (home/hub/spoke/guard) |
| `openspec/specs/seo-microsite-structure/` | Modify | Lock nested, reject flat (separate task) |

## Route Precedence Proof

Astro resolves routes by specificity, not file order. Ranking (most→least specific):
static routes > named dynamic params > **rest/spread params** (lowest priority, matched last).
Therefore `src/pages/index.astro` (static, matches `/`) and `src/pages/api/lead.ts` (static,
matches `/api/lead`) both outrank `[...slug].astro`. The rest param only catches paths no more
specific route claims. `index` is additionally filtered out of `getStaticPaths` (L12), so no
duplicate `/` path is generated. Confirm at build: 49 routes, `/` from `index.astro`,
`/api/lead` server endpoint, spokes nested, hubs single-segment.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `getPageUrl` home/hub/spoke/guard | `getPageUrl.test.ts`, `node --test` |
| Unit | Spoke nested URL in silo links | Add `laterals`/`spokes` url === `/construccion-bardas/zona-hotelera` in `siloLinking.test.ts` |
| Unit (regression) | Hub/home URLs unchanged | Existing L91/L117/L122 must stay green |
| Build (integration) | 49 pages build; precedence holds | `pnpm build`; inspect `dist/` nested spoke dirs |

New assertions (STRICT TDD — write failing first):
```ts
// siloLinking.test.ts — Hub test: spoke url is nested
assert.strictEqual(result.spokes[0].url, '/construccion-bardas/zona-hotelera');
// Spoke test: lateral same-loc-diff-service nested
assert.ok(result.laterals.some((l) => l.url === '/acabados-finos/centro'));
```

## Migration / Rollout

No data migration. Pre-launch, no live URLs → no 301 map. Clean swap.

## Rollback

Single-commit revert: restore `[slug].astro`, delete `getPageUrl.ts` + `getPageUrl.test.ts`,
revert `siloLinking.ts` and its test, revert spec. No content/git churn to unwind.

## Open Questions

- [ ] None blocking. Confirm `pnpm build` emits exactly 49 routes with nested spoke dirs during apply.
