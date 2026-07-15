# Tasks: Privacy & Cookies Compliance Banner

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~300 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation / Infrastructure

- [x] **1.1 [src/content.config.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content.config.ts)**: Extend Zod enum for page types to allow `'legal'` value.
- [x] **1.2 [src/utils/siloLinking.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/utils/siloLinking.ts)**: Update `SiloPageData` type interface to allow `'legal'` page type.
- [x] **1.3 [src/utils/siloLinking.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/utils/siloLinking.ts)**: Exclude `type: 'legal'` from silo node linking calculations in `getSiloLinks()`.
- [x] **1.4 [src/utils/siloLinking.test.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/utils/siloLinking.test.ts)**: Add a mock legal page and assert it is excluded from all generated links.

## Phase 2: Core Implementation (UI & Pages)

- [x] **2.1 [src/content/pages/politica-privacidad.md](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content/pages/politica-privacidad.md)**: Create Privacy Policy content with owner `hstrejoluna` and email `hectortrejoluna23@gmail.com`.
- [x] **2.2 [src/content/pages/politica-cookies.md](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content/pages/politica-cookies.md)**: Create Cookie Policy content detailing analytic/advertising cookies.
- [x] **2.3 [src/components/CookieBanner.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/CookieBanner.astro)**: Implement floating cookie consent banner with inline styles.
- [x] **2.4 [src/components/CookieBanner.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/CookieBanner.astro)**: Implement client script to check `localStorage` and toggle banner visibility.
- [x] **2.5 [src/components/CookieBanner.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/CookieBanner.astro)**: Implement Aceptar/Rechazar buttons logic that records preference and triggers GTM.

## Phase 3: Integration & Wiring

- [x] **3.1 [src/layouts/Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro)**: Remove hardcoded GTM tag script from `<head>` and inject GTM consent default initialization.
- [x] **3.2 [src/layouts/Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro)**: Update columns wrapper to render full-width (hide sidebar, breadcrumbs, and landmarks) for `'legal'` page type.
- [x] **3.3 [src/layouts/Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro)**: Add footer navigation links to legal policies with `rel="nofollow"` attributes.
- [x] **3.4 [src/layouts/Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro)**: Render `CookieBanner` component right before `</body>`.
- [x] **3.5 [src/pages/[...slug].astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/pages/%5B...slug%5D.astro)**: Wrap `LeadForm` and `SiloLinks` slots in a conditional checking that page `type !== 'legal'`.

## Phase 4: Testing & Verification

- [x] **4.1**: Execute automated unit tests (`pnpm test`) to ensure no regressions.
- [x] **4.2**: Execute TypeScript validation (`pnpm typecheck`) and verify zero errors.
- [x] **4.3**: Manually verify GTM blocks on initial load and that clicking Reject keeps GTM blocked while hiding the banner.
- [x] **4.4**: Manually verify clicking Accept updates GTM consent to granted, saves to `localStorage`, and injects GTM scripts.
