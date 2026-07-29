# Proposal: Page Transitions and Motion

## Intent
Enable seamless Single Page Application (SPA) client-side navigation using Astro v5 `ClientRouter` and elevate user experience with modern CSS view transitions and scroll-reveal animations across all pages.

## Scope
### In Scope
- Integrate `ClientRouter` into `src/layouts/Layout.astro` `<head>`.
- Refactor DOM script event listeners (`Layout.astro`, `LeadForm.astro`, `CookieBanner.astro`) to register on `astro:page-load` for persistent script execution across soft navigations.
- Define custom View Transition animations (`fade-slide`) for root page transitions in `src/styles/global.css`.
- Add scroll-driven reveal animations using `@supports (animation-timeline: view())` with an `IntersectionObserver` fallback for non-supporting browsers.
- Implement comprehensive `prefers-reduced-motion: reduce` media query overrides to disable or minimize animations for users requesting reduced motion.

### Out of Scope
- Backend API or form processing logic modifications.
- Dynamic route schema or content structure changes.
- Complex 3D or WebGL motion graphics.

## Capabilities
### New Capabilities
- Smooth page-to-page transitions with zero layout shift during navigation.
- Scroll-triggered entrance animations for key section components (`.hero-section`, `.main-article`, `.silo-section`, `.landmarks-box`).

### Modified Capabilities
- Client-side script handling: Event listeners execute reliably on initial load and subsequent client-side SPA navigations.

## Approach
1. Update `Layout.astro` `<head>` to import and mount `<ClientRouter />` from `astro:transitions`.
2. Wrap script setup handlers in `Layout.astro`, `LeadForm.astro`, and `CookieBanner.astro` inside `document.addEventListener('astro:page-load', ...)` functions.
3. Configure CSS view transition keyframes and rule declarations on `::view-transition-old(root)` and `::view-transition-new(root)`.
4. Apply scroll-driven animations with fallback scripts executing on `astro:page-load`.
5. Enforce accessibility standards via `prefers-reduced-motion` overrides.

## Affected Areas
- `src/layouts/Layout.astro`
- `src/components/LeadForm.astro`
- `src/components/CookieBanner.astro`
- `src/styles/global.css`

## Risks & Mitigation
- **Risk**: Event listener duplication across SPA navigations.
  - **Mitigation**: Enforce idempotent event listener registration on `astro:page-load`.
- **Risk**: Performance regressions on low-end devices.
  - **Mitigation**: Restrict transition properties strictly to hardware-accelerated CSS properties (`transform`, `opacity`).

## Rollback Plan
Revert changes to `Layout.astro`, `LeadForm.astro`, `CookieBanner.astro`, and `global.css` using `git checkout` / `git revert`.

## Success Criteria
- Client-side soft navigation operates seamlessly without page reloads.
- Form inputs and interactive UI components function reliably after page transitions.
- Motion animations respect user preferences for `prefers-reduced-motion`.
