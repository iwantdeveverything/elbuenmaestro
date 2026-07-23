# Proposal: SEO Critical Fixes

## Intent

Resolve critical security header, entity SEO, internal linking structure, and content length/readability issues to enhance search engine visibility, indexation, and trust.

## Scope

### In Scope
- Create `/vercel.json` with routing security headers (HSTS, CSP, X-Frame-Options, etc.).
- Whitelist Google Tag Manager and Google Fonts in CSP directives (no other third-party scripts).
- Add `sameAs` links targeting Google Business Profile and the Facebook page (`https://www.facebook.com/profile.php?id=61576427536922`) to `LocalBusiness` in `Layout.astro` (no LinkedIn, Twitter, Wikipedia).
- Remove `rel="nofollow"` from footer legal links.
- Render local page lateral links in a discrete block titled `"Otros servicios de albañilería en [Zona]"` at page end.
- Re-architect `siloLinking.ts` for symmetric lateral and bi-directional circular neighbor links.
- Expand homepage (`index.md`) to 450+ words using short sentences/paragraphs, and Cancun-local terms (*Solonchak soil*, *karst caliza subsoil*, *sascab filling compacted to Proctor density*, *wind force formulas*, *hurricane history*).
- Update tests in `siloLinking.test.ts`.

### Out of Scope
- Third-party scripts not matching GTM or Google Fonts.
- Additional sameAs profiles (LinkedIn, Twitter/X, Wikipedia).

## Capabilities

### New Capabilities
- `vercel-routing-security`: Route-level HTTP security headers and CSP rules deployed via Vercel.

### Modified Capabilities
- `local-seo-silo-graph`: Symmetrical lateral cross-linking and circular neighbor cycle navigation.
- `entity-seo-schema`: Entity validation using verified profile links via `sameAs`.

## Approach

Configure headers in `/vercel.json`. Add `sameAs` array to `Layout.astro`. Rewrite `siloLinking.ts` for symmetrical lateral links and bi-directional neighbors. Render discrete lateral links container. Expand homepage copy in Spanish using Cancun geographic terms.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `/vercel.json` | New | Set routing headers and CSP. |
| `src/layouts/Layout.astro` | Modified | Add `sameAs`, strip `nofollow`, render lateral block. |
| `src/utils/siloLinking.ts` | Modified | Symmetrical lateral and bi-directional links. |
| `src/utils/siloLinking.test.ts` | Modified | Adjust tests for new assertions. |
| `src/content/pages/index.md` | Modified | Expand copy to 450+ words. |

## Risks

- **CSP blockages**: GTM/Fonts blocked. Mitigation: Whitelist their domains and allow `'unsafe-inline'`.

## Rollback Plan

Run `git checkout HEAD -- src/layouts/Layout.astro src/utils/siloLinking.ts src/utils/siloLinking.test.ts src/content/pages/index.md && rm -f vercel.json`

## Dependencies

- None

## Success Criteria

- [ ] Security headers and CSP pass auditing.
- [ ] LocalBusiness schema has GBP and Facebook sameAs links.
- [ ] Lateral links render symmetrically and tests pass.
- [ ] Homepage has 450+ words with required Cancun terms.
