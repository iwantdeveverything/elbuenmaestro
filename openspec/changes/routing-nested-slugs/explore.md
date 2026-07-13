# Exploration: routing-nested-slugs

## Current State

**Router (`src/pages/[slug].astro`)** — flat, single-segment catch-all. `getStaticPaths` calls `getCollection('pages')`, filters out `id === 'index'`, and returns `params: { slug: page.id }` with `props: { page }`. Because the param is `page.id` (the markdown filename), a spoke `bardas-zona-hotelera.md` becomes `/bardas-zona-hotelera`. Hubs like `construccion-bardas.md` become `/construccion-bardas`.

**Home (`src/pages/index.astro`)** — separate file, uses `getEntry('pages','index')`. Not affected by nested routing; already filters itself out.

**Content model (`src/content.config.ts`)** — `glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' })`. `id` = filename (no extension). All files currently flat in one folder. Schema fields: `title, description, h1, type('hub'|'spoke'), service, locationName?, locationSlug?, parentHub?, landmarks?, neighborhoodContext?`.

File-naming convention: hubs are `{service}.md` (4 files); spokes are `{prefix}-{location}.md` (44 files). Verified across all 48 non-index files:
- **All 44 spokes carry BOTH `locationSlug` AND `parentHub`.**
- **`parentHub` always equals the hub page `id`** (`construccion-bardas`, `remodelacion-acabados`, `pisos-azulejos`, `reparaciones-estructurales`) — never the bare `service` value.

Critical finding: the nested URL for any spoke is deterministically `/${parentHub}/${locationSlug}`, and the hub URL stays single-segment `/${hub.id}`. **No frontmatter changes required** to derive nested URLs.

**Silo linking (`src/utils/siloLinking.ts`)** — every URL built as `/${...id}`. Sites that must change for spoke URLs:
- L52 — hub links from home: `url: /${page.id}` (hub, STAYS single-segment)
- L73 — spoke links from hub: `url: /${page.id}` → must become nested
- L95–96 — parentHub link from spoke: `url: /${parentHubEntry.id}` (hub, STAYS)
- L100–103 — home link `url: '/'` (STAYS)
- L123 — lateral same-loc-diff-service spoke: `url: /${sameLocDiffService.id}` → nested
- L150–152 — lateral next spoke: `url: /${nextSpoke.id}` → nested
- L164–166 — lateral prev spoke: `url: /${prevSpoke.id}` → nested

**`src/components/SiloLinks.astro`** — purely renders `link.url`; no URL construction. No change needed if URLs come pre-built.

**Tests (`src/utils/siloLinking.test.ts`)** — URL assertions today: L91 `hubs[0].url === '/construccion-bardas'`, L117 `parentHub.url === '/construccion-bardas'`, L122 `home.url === '/'`. All three are hub/home URLs that STAY unchanged, so **no existing assertion breaks**. Coverage gap: no test asserts a spoke's own URL. Nested spoke assertions must be ADDED.

**`test/lead.test.ts` + `src/components/LeadForm.astro`** — post to hardcoded `/api/lead`; no slug/pageSlug coupling. Unaffected.

**Hardcoded links (`src/layouts/Layout.astro`)** — L98 nav and L193 footer hardcode `/construccion-bardas`. Hub URLs stay single-segment → remain correct. (Pre-existing gap unrelated to this change: only 1 of 4 hubs linked in nav/footer.)

**Other**: canonical URL + JSON-LD in `Layout.astro` derive from `Astro.url.pathname` → auto-follow nested routes. No sitemap integration present. `astro.config.mjs` uses Vercel adapter, static default; `/api/lead` is `prerender=false`.

## Affected Areas
- `src/pages/[slug].astro` — flat `[slug]` cannot emit multi-segment paths; must handle nested params and derive URL per page type.
- `src/utils/siloLinking.ts` — 4 spoke-URL sites must produce nested URLs; 2 hub/home sites stay.
- `src/utils/siloLinking.test.ts` — add spoke nested-URL assertions.
- `scratch/generate-content.js` (gitignored) — writes flat `{prefix}-{loc.slug}.md`. Only impacted if chosen approach restructures folders or adds frontmatter.
- NOT affected: `Layout.astro`, `LeadForm.astro`, `test/lead.test.ts`, `index.astro`, `content.config.ts` (schema already sufficient).

## Approaches

### 1. Rest-param router + shared `getPageUrl()` helper
Rename `src/pages/[slug].astro` to `[...slug].astro`. Add a single helper: hub → `/${page.id}`, spoke → `/${page.data.parentHub}/${page.data.locationSlug}`. Use it in both `getStaticPaths` (`params: { slug: getPageUrl(page).slice(1) }`) and all `siloLinking.ts` URL sites. Content files and generator stay flat and untouched.
- **Pros**: Minimal diff; single source of URL truth; no content/git churn; frontmatter already sufficient; `/api/lead` keeps route priority over rest catch-all.
- **Cons**: `[...slug].astro` matches everything — must confirm API route + `index` still take precedence (they do: more-specific routes win).
- **Effort**: Low.

### 2. Two dedicated route files
`src/pages/[hub].astro` for hubs and `src/pages/[hub]/[location].astro` for spokes.
- **Pros**: Explicit, self-documenting segment structure.
- **Cons**: Duplicates Layout/SiloLinks/LeadForm wiring across two files; two `getStaticPaths`; drift risk.
- **Effort**: Medium.

### 3. Restructure content into hub folders
Move spokes into `src/content/pages/{hub}/{location}.md` so `page.id` becomes `construccion-bardas/zona-hotelera`.
- **Pros**: `id` naturally encodes nested path.
- **Cons**: Heavy git churn (44 file moves) mid stacked-PR chain; rewrite generator output layout; `siloLinking.ts` matching (compares against `page.id`) needs rework since `id` shape changes.
- **Effort**: High.

## Recommendation

**Approach 1 (rest-param router + shared `getPageUrl()` helper).** Frontmatter already guarantees clean derivation (`/${parentHub}/${locationSlug}`) with zero content edits; the generator stays untouched; centralizing URL construction in one helper removes the current duplication of `/${id}` across seven sites. Smallest, most reviewable diff; keeps stacked-PR history stable. Approach 3 is elegant but file-move/generator churn is disproportionate; Approach 2 duplicates layout wiring for no gain.

## Risks
- **Rest-param precedence**: verify `[...slug].astro` does not shadow `index.astro` or `/api/lead` (Astro resolves more-specific first — confirm at build).
- **Use `parentHub` not `service`** for URL derivation: `siloLinking.ts` matching accepts `service` as fallback (L67-68, L85-87); for URLs use `parentHub` specifically (= hub id for all 44) to avoid `/bardas/...` mismatches.
- **Test coverage gap**: spoke self-URLs currently unasserted; add nested assertions or a regression ships silently.
- **Generator invariant**: if content ever regenerated via `scratch/generate-content.js`, must keep emitting `locationSlug` + `parentHub`.
- **SEO 301s**: switching live URLs would normally need redirects, but site is pre-launch → no redirect map required now. **Confirm.**

## Ready for Proposal
Yes. Well-bounded: one router file, one helper, one utility's URL sites, plus added tests. Proceed to `sdd-propose` with Approach 1.
