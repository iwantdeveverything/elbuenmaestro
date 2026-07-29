# Tasks: Page Transitions and Motion

## Review Workload Forecast
- **Estimated Lines**: ~150-220 lines (ClientRouter mounting, script lifecycle migration, and CSS motion rules)
- **Risk Level**: Low (Presentation and client navigation enhancement only; no schema or backend changes)
- **PR Strategy**: Single PR

## Tasks

### Phase 1: Navigation & Transition Foundation
- [x] 1.1 Mount `<ClientRouter />` from `astro:transitions` inside the `<head>` of `src/layouts/Layout.astro`.
- [x] 1.2 Re-bind the mobile navigation toggle script in `src/layouts/Layout.astro` to execute on the `astro:page-load` event.
- [x] 1.3 Add custom View Transition keyframes (`fade-out-slide`, `fade-in-slide`) targeting `::view-transition-old(root)` and `::view-transition-new(root)` in `src/styles/global.css`.

### Phase 2: Component Script Migration & Scroll Reveal
- [x] 2.1 Re-bind interactive form validation and WhatsApp submission handler in `src/components/LeadForm.astro` to the `astro:page-load` event.
- [x] 2.2 Re-bind consent management and cookie banner interactions in `src/components/CookieBanner.astro` to the `astro:page-load` event.
- [x] 2.3 Add native CSS scroll-driven reveal animation (`@supports (animation-timeline: view())`) in `src/styles/global.css` targeting `.hero-section`, `.main-article`, `.silo-section`, and `.landmarks-box`.
- [x] 2.4 Add `IntersectionObserver` scroll-reveal JavaScript fallback in `src/layouts/Layout.astro` bound to `astro:page-load` for browsers lacking `animation-timeline` support.
- [x] 2.5 Add `prefers-reduced-motion: reduce` CSS rules in `src/styles/global.css` to disable view transitions and scroll animations for users requesting reduced motion.

### Phase 3: Verification & Build Validation
- [x] 3.1 Run static type check with `pnpm typecheck` (or `pnpm check`).
- [x] 3.2 Run test suite with `pnpm test`.
- [x] 3.3 Run production build verification with `pnpm build`.
- [x] 3.4 Validate soft navigation persistence, interactive script bindings, scroll-reveal behavior, and `prefers-reduced-motion` compliance.
