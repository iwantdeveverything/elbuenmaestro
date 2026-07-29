# Exploration Report: page-transitions-and-motion

## Executive Summary
Evaluation and architectural plan for integrating Astro v5 View Transitions (`ClientRouter`), smooth page navigation transitions, section entrance/reveal animations, script re-initialization hooks (`astro:page-load`), and accessibility motion controls (`prefers-reduced-motion`) into the **El Buen Maestro** codebase.

---

## 1. Codebase Architecture & Current State
- **Layout Structure**: `src/layouts/Layout.astro` serves as the sole layout for all site pages (`index.astro` and `[...slug].astro`).
- **Interactive Scripts**:
  - `Layout.astro`: Inline script handles mobile menu toggle (`#nav-toggle` & `#nav-menu`).
  - `LeadForm.astro`: Inline script attaches form submission and validation listeners on `DOMContentLoaded`.
  - `CookieBanner.astro`: Handles consent modal/banner state and local storage.
- **Current Styling & Design Tokens**:
  - Global CSS tokens in `Layout.astro` (`:root`): `--ease-spring`, `--ease-smooth`, `--duration-fast`, `--duration-normal`.
  - GPU properties (`transform`, `opacity`) used in existing button shimmers and success alerts.

---

## 2. Astro v5 View Transitions Integration Plan
### 2.1 Import & Head Injection
- Import `ClientRouter` in `src/layouts/Layout.astro`:
  ```typescript
  import { ClientRouter } from 'astro:transitions';
  ```
- Render `<ClientRouter />` in `<head>` of `Layout.astro`.

### 2.2 Script Lifecycle Migration (`astro:page-load`)
When Astro's `ClientRouter` performs client-side navigation, the DOM body is updated without re-firing `DOMContentLoaded`.
- Update `Layout.astro` mobile nav script:
  ```javascript
  document.addEventListener('astro:page-load', () => {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    toggle?.addEventListener('click', () => {
      const open = menu?.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  ```
- Update `LeadForm.astro` script: Replace `DOMContentLoaded` listener with `astro:page-load` to keep lead submission active across page transitions.

### 2.3 Element State Persistence
- Add `transition:persist` directive to persistent layout components like site `<header>` and `<CookieBanner />` to avoid unnecessary re-rendering and keep UI state smooth.

---

## 3. Page Navigation Transitions Design
### 3.1 Keyframes & Animations
Utilize native CSS View Transitions API (`::view-transition-old(root)` and `::view-transition-new(root)`):
- **Old Page Out**: Fade out and scale slightly (`opacity: 1 -> 0`, `transform: scale(1) -> scale(0.99)`).
- **New Page In**: Fade in and translate vertically (`opacity: 0 -> 1`, `transform: translateY(8px) -> translateY(0)`).
- **Performance Guarantee**: Exclusively animating `transform` and `opacity` to preserve **0 CLS** and **0 INP**.

---

## 4. Section Entrance / Reveal Animations
### 4.1 Scroll-Driven & Observer Reveals
- **Pure CSS Scroll Animations**: Use `@supports (animation-timeline: view())` for modern Chrome/Edge browsers:
  ```css
  @keyframes revealEntrance {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .reveal-on-scroll {
    animation: revealEntrance linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 25%;
  }
  ```
- **Fallback Support**: Lightweight `IntersectionObserver` script attached on `astro:page-load` for browsers without `animation-timeline` support, applying `.is-visible` class.

### 4.2 Targeted Elements
- Hero heading & description
- Article content blocks (`.main-article > *`)
- Local landmarks box (`.landmarks-box`)
- Silo navigation links (`.silo-section`)
- Sidebar quote form container (`.sticky-box`)

---

## 5. Accessibility & Motion Controls (`prefers-reduced-motion`)
To satisfy strict accessibility guidelines and respect user OS preferences:
- Define comprehensive media query rule in global CSS:
  ```css
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }

    .reveal-on-scroll {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
  ```

---

## 6. Target File Modification Map
1. `src/layouts/Layout.astro`:
   - Import & add `<ClientRouter />`.
   - Update nav script listener to `astro:page-load`.
   - Add view transition CSS and scroll reveal keyframes with `@media (prefers-reduced-motion: reduce)` overrides.
2. `src/components/LeadForm.astro`:
   - Update form script event listener to `astro:page-load`.
3. `src/components/CookieBanner.astro`:
   - Ensure event listeners re-attach correctly on page navigation.

---

## 7. Verification & Quality Assurance Plan
- **Astro Build / Dev**: Test site navigation using `astro dev`.
- **Performance**: Audit via Chrome DevTools to ensure zero CLS and < 50ms INP during page switches.
- **Accessibility**: Emulate `prefers-reduced-motion: reduce` in DevTools Rendering panel to verify all animations pause gracefully.
