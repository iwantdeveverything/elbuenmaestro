# Proposal: Privacy & Cookies Compliance Banner

## Intent

Ensure legal compliance and respect user privacy by implementing a privacy policy, cookie policy, and cookie consent banner supporting Google Tag Manager (GTM) Consent Mode v2 on the `elbuenmaestro` website.

## Scope

### In Scope
- Privacy Policy page (`/politica-privacidad`) and Cookie Policy page (`/politica-cookies`) showing owner `hstrejoluna` and email `hectortrejoluna23@gmail.com`.
- Non-intrusive bottom-bar cookie consent banner (`CookieBanner.astro`) supporting simple Accept/Reject options.
- Integration with GTM Consent Mode v2 (Basic Consent Mode: block tracking before explicit acceptance, update GTM consent state on Accept).
- Schema/Zod type updates to allow `legal` page types.
- Link updates in layout footer to point to legal pages.
- Excluding legal pages from the local SEO internal silo linking graph.

### Out of Scope
- Advanced consent customization panels (e.g., toggling specific categories of cookies).
- Multilingual translation of legal texts (defaulting to neutral Spanish).

## Capabilities

### New Capabilities
- `privacy-cookies-policy`: Legal pages containing owner details (`hstrejoluna`) and contact mail (`hectortrejoluna23@gmail.com`).
- `cookie-consent-banner`: Bottom bar cookie consent banner implementing basic consent mode for GTM.

### Modified Capabilities
- None

## Approach

Use content collections for legal documents by introducing a `legal` page type in `src/content.config.ts` (Approach 1). Render pages dynamically via `src/pages/[...slug].astro`, tweaking `src/layouts/Layout.astro` to hide sidebar lead capture, landmarks, and local SEO silo links on `legal` pages. Implement GTM consent defaults in `Layout.astro` head before GTM loads, and load a client-side `CookieBanner` component to handle explicit user choices and update consent state.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/content.config.ts` | Modified | Update Zod schema to include `legal` page type. |
| `src/layouts/Layout.astro` | Modified | Inject GTM consent default script, render CookieBanner, style legal template to be full-width (no sidebar), and append links to footer. |
| `src/utils/siloLinking.ts` | Modified | Filter out `legal` page type from SEO silo linking nodes. |
| `src/components/CookieBanner.astro` | New | Bottom-bar UI component for consent popup. |
| `src/content/pages/politica-privacidad.md` | New | Legal text for Privacy Policy. |
| `src/content/pages/politica-cookies.md` | New | Legal text for Cookie Policy. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Silo internal link pollution | Med | Filter out `legal` pages in `siloLinking.ts` and `Layout.astro`. |
| Tag triggering before consent | Low | Position consent default script as the first script element in `<head>`. |

## Rollback Plan

Revert all changes using git:
```bash
git checkout HEAD -- src/content.config.ts src/layouts/Layout.astro src/utils/siloLinking.ts
git clean -fd src/components/CookieBanner.astro src/content/pages/politica-privacidad.md src/content/pages/politica-cookies.md
```

## Dependencies

- None

## Success Criteria

- [ ] Pages route successfully at `/politica-privacidad` and `/politica-cookies`.
- [ ] Cookie Banner displays properly as a bottom bar on first load.
- [ ] Basic consent mode blocks cookie tracking until accepted, and GTM updates correctly upon clicking Accept.
