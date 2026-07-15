# Design for privacy-cookies-banner

## Technical Approach
This design details the technical implementation of legal compliance pages (`/politica-privacidad` and `/politica-cookies`) and an interactive cookie consent banner implementing Google Tag Manager (GTM) Consent Mode v2 (Basic Consent Mode). The design ensures that:
1. No tracking or analytic script is loaded or run until the user gives explicit consent ("Basic Consent Mode").
2. Legal pages use a distraction-free, full-width layout (no contact forms, no breadcrumbs, and no landmarks).
3. Legal pages do not pollute the local SEO internal linking structure.
4. Footers are updated with `rel="nofollow"` links to these pages.

---

## Architecture Decisions

### 1. Dynamic GTM Loading vs. Inline Script (Basic Consent Mode)
To strictly enforce Basic Consent Mode, the existing hardcoded GTM container script is removed from the layout header. Instead:
- A lightweight, inline initialization script in `<head>` defines `window.dataLayer` and registers a default `denied` state for all GTM consent categories (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`).
- GTM container loading is deferred. The container script will *only* load dynamically (via a script insertion snippet) if the user has accepted cookies (either on subsequent load from `localStorage` or immediately when clicking "Aceptar").
- If the user rejects cookies, the banner is hidden, and GTM is never fetched or executed.

### 2. Content Collection Addition vs. Raw Pages
Rather than creating standalone Astro pages (`src/pages/*.astro`), the legal pages are integrated into the existing `pages` content collection under `src/content/pages/`.
- We extend the `pages` schema `type` field in `src/content.config.ts` to accept `'legal'`.
- Dynamic routing in `src/pages/[...slug].astro` resolves legal paths.
- The `Layout.astro` component uses a conditional full-width layout without sidebars, landmarks, or breadcrumbs when `type === 'legal'`. This preserves a unified component architecture and makes editing content straightforward.

---

## Consent & Data Flow (Basic Mode)

```
[ Visit / Load Page ] ──► [ Header Script ] ──► Sets default consent 'denied'
                                                      │
                                                      ▼
                                       [ LocalStorage check ]
                                       /                    \
                         (not set)    /                      \ (accepted)
                                     ▼                        ▼
                        [ Show Banner ]              [ Load GTM Script ]
                        /             \              [ Update Consent to 'granted' ]
             (Accept)  /               \ (Reject)
                      ▼                 ▼
          [ Update Consent 'granted' ]  [ Store 'rejected' ]
          [ Load GTM Script ]           [ Hide Banner ]
          [ Store 'accepted' ]          [ GTM never loads ]
          [ Hide Banner ]
```

---

## File Changes

### [src/content.config.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content.config.ts)
- Update `type` validator to `z.enum(['hub', 'spoke', 'legal'])`.

### [src/layouts/Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro)
- Extend `Props` type with `type?: 'hub' | 'spoke' | 'legal'`.
- Replace the hardcoded GTM `<script>` in `<head>` with an inline GTM consent default initialization.
- If `type === 'legal'`:
  - Wrap columns to render full-width (hide `<aside class="sidebar">` and its slots).
  - Hide `<div class="landmarks-box">` and `<nav class="breadcrumb-nav">`.
  - Exclude the `silo-links` slot wrapper.
- Update `footer-bottom` to contain:
  ```html
  <div class="footer-legal">
    <a href="/politica-privacidad" rel="nofollow">Política de Privacidad</a> | 
    <a href="/politica-cookies" rel="nofollow">Política de Cookies</a>
  </div>
  ```
- Import and render `CookieBanner` before `</body>`.

### [src/utils/siloLinking.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/utils/siloLinking.ts)
- Update `SiloPageData` schema interface to include `'legal'` type.
- Exclude `type: 'legal'` pages from being parsed, linked, or served in `getSiloLinks()`.

### [src/components/CookieBanner.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/CookieBanner.astro) (New)
- Renders a floating bottom-bar banner with a brief disclaimer and links to `/politica-cookies`.
- Inline styling utilizing variables (`--bg-dark-card`, `--primary`, `--text-dark`).
- Client-side `<script>`:
  - Checks `localStorage.getItem('cookie-consent')`. If empty, shows banner (removes `hidden` class).
  - Handles "Aceptar" click: Stores `'accepted'`, updates GTM consent to `'granted'`, injects GTM container script, and hides banner.
  - Handles "Rechazar" click: Stores `'rejected'`, hides banner.
  - If already `'accepted'`, immediately dynamically loads the GTM script.

### [src/content/pages/politica-privacidad.md](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content/pages/politica-privacidad.md) (New)
- Markdown page with metadata `type: "legal"`, `service: "legal"`.
- Displays owner `hstrejoluna` and email `hectortrejoluna23@gmail.com`.

### [src/content/pages/politica-cookies.md](file:///home/hstrejoluna/Projects/elbuenmaestro/src/content/pages/politica-cookies.md) (New)
- Markdown page with metadata `type: "legal"`, `service: "legal"`.
- Explains analytical/advertising cookies and consent management.

---

## Testing Strategy

### 1. Automated Unit Tests
- Modify `src/utils/siloLinking.test.ts` to include a legal page mock and verify it is excluded from all generated link lists.
- Execute `pnpm test` to verify zero regression.

### 2. Manual Integration Verification
- **First Load**: Clear site data. Verify the banner is shown, GTM script (`gtm.js`) is *not* present in the DOM, and `localStorage` is empty.
- **Reject Choice**: Click "Rechazar". Confirm the banner is hidden, `localStorage` has `'cookie-consent': 'rejected'`, and no GTM tags are present.
- **Accept Choice**: Clear localStorage. Click "Aceptar". Confirm the banner is hidden, `localStorage` has `'cookie-consent': 'accepted'`, the GTM script tag is appended dynamically to the DOM, and the dataLayer shows the consent update trigger.
- **Subsequent Load**: Refresh the page with `'accepted'` or `'rejected'` stored. Confirm the banner does not show, and GTM script is loaded/skipped matching the state.
