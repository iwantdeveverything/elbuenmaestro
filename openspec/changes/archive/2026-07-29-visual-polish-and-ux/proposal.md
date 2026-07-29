# Proposal: Visual Polish and UX Enhancement

## Intent
Elevate visual design, user experience, accessibility, and interactive feedback across core microsite components using modern vanilla CSS techniques without adding third-party runtime UI dependencies.

## Scope
### In Scope
- `src/layouts/Layout.astro`: Design system CSS custom properties (tokens), fluid typography clamp rules, ambient hero lighting gradient, mobile menu drawer animation, header glassmorphism effect, and custom `:focus-visible` accessibility indicators.
- `src/components/LeadForm.astro`: Real-time native form validation styling with `:user-valid` and `:user-invalid`, focus glowing borders, interactive button hover/active shimmer effects, submit loading spinner state, and success alert entrance animation.
- `src/components/SiloLinks.astro`: Modern glassmorphism card styling with `backdrop-filter`, subtle hover scale/elevation transitions, pill badge hover highlight effects, and link indicator accents.
- `src/components/CookieBanner.astro`: Entry/exit slide transition animation, glassmorphism backdrop blur, and button micro-feedback state adjustments.

### Out of Scope
- Backend API endpoints or server-side form submission handling changes.
- Content schema modifications or new SILO pages creation.
- External animation or styling library installations (e.g., TailwindCSS, Framer Motion).

## Capabilities
### New Capabilities
- Fluid typography and responsive layout spacing using native CSS `clamp()`.
- Accessible custom glowing focus indicator ring for interactive elements.
- Visual micro-interaction feedback system for cards, badges, and lead forms.

### Modified Capabilities
- Form validation feedback now uses standard CSS `:user-valid` / `:user-invalid` pseudo-classes for cleaner UX during interaction.
- Header and cookie banner visual appearance updated to glassmorphism with smooth backdrop blur.

## Approach
Implement standard vanilla CSS design tokens and modern features (`clamp()`, `backdrop-filter`, `:focus-visible`, `:user-valid`, `:user-invalid`, `transform`, `transition`) directly into existing Astro components and global layout styles. Maintain zero external framework overhead while maximizing visual impact.

## Affected Areas
- `src/layouts/Layout.astro`
- `src/components/LeadForm.astro`
- `src/components/SiloLinks.astro`
- `src/components/CookieBanner.astro`

## Risks & Mitigations
- **Risk**: Backdrop blur rendering inconsistencies in legacy browser engines.
  - **Mitigation**: Provide fallback solid/semi-transparent background colors for legacy fallback support.
- **Risk**: Cumulative Layout Shift (CLS) from hover and entrance animations.
  - **Mitigation**: Restrict layout transitions strictly to GPU-accelerated CSS properties (`transform`, `opacity`).

## Rollback Plan
Revert commit changes in `src/layouts/Layout.astro`, `src/components/LeadForm.astro`, `src/components/SiloLinks.astro`, and `src/components/CookieBanner.astro` via `git checkout` or `git revert`.

## Success Criteria
- Zero runtime JS overhead added for visual styling.
- All lead form inputs display distinct focus, valid, and invalid visual states cleanly.
- Header, cards, and cookie banner exhibit smooth glassmorphism rendering without layout shift.
- Keyboard navigation displays dynamic focus rings across all interactive controls.
