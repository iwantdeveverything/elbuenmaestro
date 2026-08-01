## Exploration: whatsapp-ctas

### Current State
- **Header Structure**: The site header in `src/layouts/Layout.astro` currently features a glassmorphic design (`.site-header`) with a logo, mobile toggle button, nav links for services (`HUBS`), and a generic amber CTA button (`.btn-quote`) that scrolls to `#contacto` (the inline lead form). There is no direct WhatsApp CTA in the header.
- **Floating Elements**:
  - `<GoogleReviewBadge />` is positioned fixed at `bottom: 1.5rem; left: 1.5rem; z-index: 99;` (bottom-left corner).
  - `<CookieBanner />` is positioned fixed at the bottom center of the screen as an overlay bar.
  - There is currently **no floating WhatsApp button** present on the site.
- **Contact & Phone Constants**:
  - `PHONE_DISPLAY` (`'998 493 4110'`) and `PHONE_SCHEMA` (`'+529984934110'`) are defined locally inside `src/layouts/Layout.astro` and referenced in the footer.
  - WhatsApp action links with prefilled messages are not standardized in a central configuration module.

### Affected Areas
- **`src/config/site.ts` (New File)**: Centralize contact numbers, WhatsApp phone (`529984934110`), schema phone (`+529984934110`), display phone (`998 493 4110`), and prefilled default WhatsApp message templates (e.g., `"Hola El Buen Maestro, me gustaría solicitar una cotización de albañilería."`).
- **`src/components/WhatsAppFloating.astro` (New File)**: Dedicated floating WhatsApp button component with:
  - Fixed positioning at `bottom: 1.5rem; right: 1.5rem; z-index: 999;` to complement `<GoogleReviewBadge />` (on the left) without layout collision.
  - Vibrant WhatsApp brand green (`#25D366`), dark green hover states (`#128C7E`), subtle ripple/pulse animation (`--ease-spring`), and custom SVG icon.
  - Desktop tooltip ("¡Cotiza por WhatsApp!") and responsive mobile FAB design (56px touch target complying with WCAG AA).
  - Proper accessibility metadata (`aria-label`, `target="_blank"`, `rel="noopener noreferrer"`).
- **`src/layouts/Layout.astro`**:
  - Import `siteConfig` from `src/config/site.ts` to replace hardcoded phone variables.
  - Add prominent, colorful WhatsApp CTA button (`.btn-whatsapp-header`) to `.site-header` alongside or enhancing `.btn-quote`.
  - Include `<WhatsAppFloating />` component before `</body>`.
- **`src/styles/global.css`**: Option to add shared utility variables for WhatsApp brand colors (e.g., `--whatsapp-green: #25d366; --whatsapp-dark: #128c7e;`).

---

### Approaches

#### 1. Header WhatsApp CTA Integration
- **Approach 1: Dual CTAs in Header (WhatsApp Green + Amber Quote) with Mobile Quick-Action (Recommended)**
  - Add `.btn-whatsapp-header` featuring WhatsApp brand green (`#25D366`), white text, inline WhatsApp SVG, and pulse/glow micro-animation.
  - Keep `.btn-quote` as secondary or combine into a clear, visual action pair in `.nav-menu`.
  - On mobile screens (< 768px), display a compact WhatsApp icon CTA in the header bar next to the burger menu toggle, enabling instant 1-tap WhatsApp access without opening the hamburger menu.
  - **Pros**:
    - Maximizes conversion for mobile users (the majority of local service inquiries in Quintana Roo come via WhatsApp).
    - Preserves internal anchor shortcut (`#contacto`) for users who prefer web form submissions.
    - Eye-catching vibrant visual contrast against dark glassmorphism background.
  - **Cons**: Slightly requires fine-tuning mobile header spacing to avoid toggle overlap.
- **Approach 2: Replace `.btn-quote` completely with WhatsApp CTA**
  - **Pros**: Cleaner header navigation with only one primary CTA.
  - **Cons**: Removes direct access to internal lead form anchor `#contacto` from top navigation.
  - **Decision**: Approach 1.

#### 2. Floating WhatsApp Component Architecture
- **Approach 1: Standalone `<WhatsAppFloating.astro>` Component positioned Bottom-Right (Recommended)**
  - Build a modular, re-usable Astro component placed at `bottom: 1.5rem; right: 1.5rem; z-index: 999`.
  - Design features:
    - Glowing badge ring / gentle wave pulse animation.
    - SVG WhatsApp logo with perfect scaling.
    - Desktop expandable hover pill ("Cotizar por WhatsApp").
    - WCAG AA compliant contrast and 56x56px touch area for mobile accessibility.
  - **Pros**:
    - Zero interference with `<GoogleReviewBadge />` located at bottom-left (`left: 1.5rem`).
    - Decoupled code, easy to maintain, test, and toggle.
    - Integrates cleanly into `Layout.astro`.
  - **Cons**: None.
- **Approach 2: Inline Floating Button directly in `Layout.astro`**
  - **Pros**: Avoids creating a new file.
  - **Cons**: Bloats `Layout.astro` (already over 1000 lines), reducing code maintainability.
  - **Decision**: Approach 1.

---

### Recommendation
We recommend proceeding with **Approach 1 for both target features**:
1. Create `src/config/site.ts` to centralize phone numbers and WhatsApp prefilled URLs.
2. Build a standalone, accessible, animated `src/components/WhatsAppFloating.astro` component fixed at `bottom: 1.5rem; right: 1.5rem`.
3. Add a vibrant green `.btn-whatsapp-header` with SVG icon in `src/layouts/Layout.astro` header, including responsive mobile quick-action support.

---

### Risks
- **Visual Overlap on Mobile**: Floating WhatsApp button on bottom-right might collide with `<CookieBanner />` when banner is active.
  - *Mitigation*: Set `z-index: 999` and add bottom margin offset or elevate floating button when cookie banner is visible, or position banner centered with clear padding.
- **Header Space on Narrow Mobile Viewports (320px - 360px)**: Adding a text button in mobile header might push the logo or burger toggle out of alignment.
  - *Mitigation*: Use responsive CSS rules: show full button text on desktop/tablet (`"WhatsApp"` or `"Cotizar por WhatsApp"`), and render a sleek compact icon badge on mobile headers.

---

### Ready for Proposal
Yes
