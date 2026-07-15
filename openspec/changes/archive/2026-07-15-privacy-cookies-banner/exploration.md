## Exploration: privacy-cookies-banner

### Current State
- **GTM Configuration**: Google Tag Manager is configured as an inline script in `src/layouts/Layout.astro` loading container `GTM-M6LW5F8P`. There is currently no consent management mechanism or initialization for Google Consent Mode v2.
- **Pages & Routing**: Routes are handled dynamically via `src/pages/[...slug].astro` which queries the `pages` content collection loaded from `src/content/pages/`.
- **Design & Layout**: Page templates use a global layout system with CSS variables defined in `src/layouts/Layout.astro` (`--bg-dark-card: #13171e`, `--primary: #f59e0b`, `--border-color: #1e293b`). The layout enforces a two-column layout (`.grid-container`) with a sticky contact form sidebar on the right and local SEO silo links at the bottom.

### Affected Areas
- `src/content.config.ts` — Update Zod schema to allow a `legal` page type.
- `src/layouts/Layout.astro` — Insert the default Google Consent Mode v2 state script before GTM loads. Import and render the `CookieBanner` component. Conditional logic to render full-width layout without sidebar, landmarks, and silo links when `type === 'legal'`. Update footer to include links to legal pages.
- `src/utils/siloLinking.ts` — Filter out `legal` type pages from participating in the SEO linking graph to avoid polluting category navigation.
- `src/components/CookieBanner.astro` — New component for the cookie consent overlay containing GTM/gtag consent update script.
- `src/content/pages/politica-privacidad.md` — New markdown content file for the Privacy Policy.
- `src/content/pages/politica-cookies.md` — New markdown content file for the Cookie Policy.

### Approaches
1. **Integrated Content Collection (`type: 'legal'`)** — Create legal pages as markdown documents inside the `pages` content collection under a new `legal` type. Adjust Layout rendering rules to display a full-width column and omit the sidebar or silo components.
   - Pros:
     - Maintains all text content in markdown under content collections.
     - Automatically routed through the existing `[...slug].astro` template.
     - Full alignment with page creation standards.
   - Cons:
     - Requires modifying content collection schema validation and filtering the silo graph.
   - Effort: Low

2. **Direct Astro Page Routes** — Build raw Astro files at `src/pages/politica-privacidad.astro` and `src/pages/politica-cookies.astro` bypassing content collections.
   - Pros:
     - Avoids adding a new type to `content.config.ts` or editing the silo logic.
   - Cons:
     - Decouples legal content management from markdown sources.
     - Still requires layout changes to accommodate full-width page options.
   - Effort: Medium

### Recommendation
We recommend **Approach 1**. Keeping legal documents as markdown in `src/content/pages/` is clean and maintainable. Modifying the `Layout.astro` template to handle a full-width viewport dynamically when `type: 'legal'` is passed is clean, reusable, and prevents cluttering the legal documents with lead capture forms and irrelevant location links.

### Risks
- **Silo Pollution**: If legal pages are not explicitly excluded from the internal linking utility (`getSiloLinks.ts`), they will appear as regular service hubs or lateral recommendations, harming the SEO crawl graph. (Mitigation: Add filter rules to `getSiloLinks.ts` to ignore the `legal` page type).
- **GTM Consent Timing**: Third-party trackers must not trigger before Consent Mode defaults are registered. (Mitigation: Place the consent defaults script at the very top of `<head>` immediately preceding GTM tag).

### Ready for Proposal
Yes
