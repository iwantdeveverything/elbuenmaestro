# Design: Page Transitions and Motion

## Technical Architecture
The motion system integrates Astro v5 `<ClientRouter />` for Single Page Application (SPA) client-side view transitions, paired with hardware-accelerated CSS animations and scroll-reveal triggers across all site pages.

- **Navigation Engine**: `<ClientRouter />` from `astro:transitions` placed in `<Layout />` `<head>`.
- **Event Lifecycle**: Interactive script initialization re-bound from `DOMContentLoaded` to `astro:page-load`.
- **Root Transitions**: View Transition API keyframes targeting `::view-transition-old(root)` and `::view-transition-new(root)`.
- **Scroll Reveal**: Progressive enhancement using CSS `@supports (animation-timeline: view())` with an `IntersectionObserver` JavaScript fallback for unsupported engines.
- **Accessibility**: Strict `prefers-reduced-motion: reduce` media query overrides.

## ClientRouter Integration (`src/layouts/Layout.astro`)
Import `<ClientRouter />` from `astro:transitions` in the `Layout.astro` frontmatter script and mount `<ClientRouter />` within `<head>`.

```astro
---
import { ClientRouter } from 'astro:transitions';
import CookieBanner from '../components/CookieBanner.astro';
// ...
---
<html lang="es">
  <head>
    <!-- ... -->
    <ClientRouter />
  </head>
  <!-- ... -->
</html>
```

## `astro:page-load` Event Re-binding Pattern
Client-side scripts must execute on initial load and subsequent client-side navigations. All component initialization handlers are wrapped inside `astro:page-load` event listeners.

### 1. `Layout.astro` Mobile Navigation
```typescript
document.addEventListener('astro:page-load', () => {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
});
```

### 2. `LeadForm.astro` Form Validation & Submission
```typescript
document.addEventListener('astro:page-load', () => {
  const form = document.getElementById('lead-form') as HTMLFormElement;
  const submitBtn = document.getElementById('btn-submit-lead') as HTMLButtonElement | null;
  if (!form || !submitBtn) return;
  
  form.addEventListener('submit', (e) => {
    // Validation & WhatsApp redirect logic
  });
});
```

### 3. `CookieBanner.astro` Consent Management
```typescript
document.addEventListener('astro:page-load', () => {
  const banner = document.getElementById('cookie-banner');
  const btnAccept = document.getElementById('btn-accept');
  const btnReject = document.getElementById('btn-reject');
  
  // Idempotent consent check and button event listener attachment
});
```

## View Transition CSS Keyframes (`src/styles/global.css`)
Transitions use hardware-accelerated CSS properties (`opacity`, `transform`).

```css
@keyframes fade-out-slide {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}

@keyframes fade-in-slide {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

::view-transition-old(root) {
  animation: 180ms cubic-bezier(0.4, 0, 0.2, 1) both fade-out-slide;
}

::view-transition-new(root) {
  animation: 220ms cubic-bezier(0.16, 1, 0.3, 1) both fade-in-slide;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
}
```

## Scroll Reveal Setup & Fallback Strategy
Target structural sections: `.hero-section`, `.main-article`, `.silo-section`, `.landmarks-box`.

### 1. Native CSS Scroll-Driven Animation
```css
@supports (animation-timeline: view()) {
  .hero-section, .main-article, .silo-section, .landmarks-box {
    animation: reveal-on-scroll linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 30%;
  }
}

@keyframes reveal-on-scroll {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2. JavaScript Fallback (`IntersectionObserver`)
```typescript
document.addEventListener('astro:page-load', () => {
  if (CSS.supports && CSS.supports('animation-timeline', 'view()')) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hero-section, .main-article, .silo-section, .landmarks-box')
    .forEach(el => observer.observe(el));
});
```

## Testing Strategy
1. **Soft Navigation Verification**: Test inter-page links to verify client-side navigation without full reloads.
2. **Interactive Event Binding**: Verify mobile nav, form submission, and cookie banner after soft navigations.
3. **Scroll Reveal Fallback**: Test section entrance effects in modern and fallback browsers without `animation-timeline`.
4. **Accessibility Audit**: Validate that `prefers-reduced-motion: reduce` disables all spatial motion and view transitions.

## Threat Matrix
N/A (Presentation and client navigation enhancement only; no backend, data model, or security boundaries modified).
