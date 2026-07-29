# Technical Design: Visual Polish and UX Enhancement

## Architecture & Technical Decisions
- **Zero-Dependency Vanilla CSS**: Enhance visual design, micro-interactions, and accessibility using native CSS modern features (`clamp()`, `:focus-visible`, `:user-valid`, `:user-invalid`, `backdrop-filter`) without external utility libraries (Tailwind, Framer Motion).
- **Global Token Architecture**: Establish design variables in `src/layouts/Layout.astro` root level to unify spacing, colors, focus states, glassmorphism, and transition curves across components.
- **GPU-Accelerated Animations**: Restrict component hover scales, drawer slides, and modal transitions strictly to `transform` and `opacity` properties to guarantee 60fps rendering and zero Cumulative Layout Shift (CLS).

## Design Tokens & Transition Specifications
```css
:root {
  /* Fluid Typography Clamps */
  --font-size-h1: clamp(2.25rem, 5vw + 1rem, 3.5rem);
  --font-size-h2: clamp(1.5rem, 3vw + 0.75rem, 2.25rem);
  --font-size-body: clamp(0.95rem, 1vw + 0.75rem, 1.125rem);

  /* Animation Curves & Timings */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-normal: 350ms;

  /* Glassmorphism Surface Tokens */
  --glass-bg-header: rgba(11, 13, 16, 0.8);
  --glass-bg-card: rgba(19, 23, 30, 0.75);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(16px);

  /* Focus & Form Feedback Glow Rings */
  --focus-ring-glow: 0 0 0 3px rgba(245, 158, 11, 0.35);
  --valid-ring-glow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  --invalid-ring-glow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}
```

## Target File Changes

### 1. `src/layouts/Layout.astro`
- Add system design CSS custom property tokens and global `:focus-visible` ring styling (`outline: 2px solid var(--primary); outline-offset: 3px; box-shadow: var(--focus-ring-glow)`).
- Implement fluid typography (`clamp()`) for hero and article heading classes.
- Enhance backdrop filter blur on `.site-header` with fallback background color for legacy renderers.
- Add radial ambient hero light gradient glow in background pseudo-elements.

### 2. `src/components/LeadForm.astro`
- Replace default focus styles with native `:user-valid` and `:user-invalid` pseudo-class rules for input fields.
- Add shimmer highlight effect on submit button hover and loading spinner state during form dispatch.
- Implement keyframe entrance animation (`opacity`, `transform`) for submission success notification.

### 3. `src/components/SiloLinks.astro`
- Apply glassmorphism styling (`backdrop-filter: blur(12px)`) to `.silo-nav` cards and pill links.
- Add hover scale elevation (`transform: translateY(-3px) scale(1.01)`) using `--ease-spring` transition timing.
- Add hover highlight color transitions for pill icons and link text accents.

### 4. `src/components/CookieBanner.astro`
- Implement smooth slide/fade entrance and exit transitions driven by `transform: translateX(-50%) translateY(...)` and `--ease-spring`.
- Add interactive micro-feedback on accept/reject buttons (`transform: translateY(-1px)`).

## Testing Strategy
1. **Keyboard Accessibility**: Verify `:focus-visible` outlines navigate cleanly via Tab key across all buttons, inputs, and links without triggering focus rings on mouse click.
2. **Fluid Typography & Responsive Layout**: Inspect viewports from 320px (mobile) to 1440px (desktop) to ensure headings scale smoothly without overflow or layout shifts.
3. **Form Validation States**: Test input interactions in `LeadForm.astro` to confirm `:user-valid` and `:user-invalid` borders display accurately post-user interaction.
4. **Performance Auditing**: Run DevTools performance trace to verify animations execute on composite layer (GPU) with 0 layout reflows.

## Threat Matrix
- N/A (Pure CSS visual and micro-interaction UX update; no security, authentication, or data boundary alterations).
