# Tasks: Visual Polish and UX Enhancement

## Review Workload Forecast
- **Estimated Lines**: ~150-250 lines (CSS custom properties and component template enhancements)
- **Risk Level**: Low
- **PR Strategy**: Single PR

## Tasks

### Phase 1: Foundation (Design Tokens & Global Layout)
- [x] 1.1 Define CSS Custom Property design tokens in `src/layouts/Layout.astro` (`:root` variables for fluid typography clamps, spring/smooth easing curves, glassmorphism surface tokens, and glow rings).
- [x] 1.2 Implement fluid typography rules using `clamp()` for hero, section headings, and body text in `src/layouts/Layout.astro`.
- [x] 1.3 Add global accessible `:focus-visible` ring styling with outline offset and glowing ring shadows in `src/layouts/Layout.astro`.
- [x] 1.4 Implement radial ambient hero light background glow gradient and header glassmorphism with `backdrop-filter` and legacy fallback background in `src/layouts/Layout.astro`.

### Phase 2: Interactive Components Feedback & Transitions
- [x] 2.1 Update `src/components/LeadForm.astro` input field validation styling using native `:user-valid` and `:user-invalid` pseudo-classes and focus glowing rings.
- [x] 2.2 Enhance `src/components/LeadForm.astro` submit button with hover shimmer effect, active loading spinner state, and keyframe entrance animation for success alert banner.
- [x] 2.3 Apply glassmorphism styling (`backdrop-filter`) and GPU-accelerated hover elevation (`transform`, `--ease-spring`) to `.silo-nav` cards and pill links in `src/components/SiloLinks.astro`.
- [x] 2.4 Add hover color transitions and pill badge highlight animations in `src/components/SiloLinks.astro`.
- [x] 2.5 Implement smooth slide/fade entrance and exit transitions for `src/components/CookieBanner.astro` using `transform` and `--ease-spring`.
- [x] 2.6 Add interactive micro-feedback button transitions (`transform: translateY(-1px)`) in `src/components/CookieBanner.astro`.

### Phase 3: Verification & Polish
- [x] 3.1 Run static type and syntax verification using `pnpm check`.
- [x] 3.2 Run component and unit test suite using `pnpm test`.
- [x] 3.3 Execute production build validation using `pnpm build`.
- [x] 3.4 Verify keyboard focus navigation (`:focus-visible`), responsive fluid scaling (320px–1440px), and DevTools CWV composite layer performance trace.
