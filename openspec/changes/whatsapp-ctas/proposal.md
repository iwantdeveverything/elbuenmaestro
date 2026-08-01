# Proposal: WhatsApp CTAs

## Intent

Enhance user conversion across the site by integrating centralized contact configuration, prominent header WhatsApp action triggers, and a dedicated floating WhatsApp component.

## Scope

### In Scope
- Create `src/config/site.ts` to centralize contact numbers (`PHONE_WHATSAPP`, `PHONE_SCHEMA`, `PHONE_DISPLAY`) and prefilled message templates.
- Create standalone floating WhatsApp button component `src/components/WhatsAppFloating.astro` positioned fixed at `bottom: 1.5rem; right: 1.5rem` with pulse animation, WCAG-compliant 56px touch target, and tooltip.
- Update `src/layouts/Layout.astro` to import site config, add desktop/mobile WhatsApp action buttons in `.site-header`, and embed `<WhatsAppFloating />` before `</body>`.

### Out of Scope
- Backend messaging integration or third-party WhatsApp chat widgets.
- Modifying non-contact navigation menus or existing lead form submission logic.

## Capabilities

### New Capabilities
- `whatsapp-direct-ctas`: Direct WhatsApp communication triggers via header action buttons and a floating quick-contact button.
- `site-contact-config`: Centralized contact details and prefilled message templates.

### Modified Capabilities
- `header-navigation`: Enhanced header navigation incorporating prominent WhatsApp quick actions.

## Approach

Define `src/config/site.ts` with target phone numbers (`529984934110`) and prefilled message strings. Build `src/components/WhatsAppFloating.astro` with brand green (`#25D366`), hover dark green (`#128C7E`), pulse animation, and bottom-right positioning (`bottom: 1.5rem; right: 1.5rem; z-index: 999`). Integrate site config and floating component into `src/layouts/Layout.astro`, while adding `.btn-whatsapp-header` to the header.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/config/site.ts` | New | Centralize contact numbers and prefilled message templates. |
| `src/components/WhatsAppFloating.astro` | New | Floating WhatsApp button component with animation and accessibility features. |
| `src/layouts/Layout.astro` | Modified | Import contact config, add header WhatsApp CTA, and embed floating button. |

## Risks

- **Mobile Viewport Overlap**: Floating WhatsApp button may conflict with cookie banner on narrow viewports.
  - *Mitigation*: Ensure `z-index: 999` and maintain clear layout separation.
- **Header Layout Truncation**: Additional button in mobile header could crowd navigation controls.
  - *Mitigation*: Render full text CTA on desktop/tablet and a compact icon badge on mobile viewports.

## Rollback Plan

Remove `src/config/site.ts` and `src/components/WhatsAppFloating.astro`, then revert changes in `src/layouts/Layout.astro` using `git checkout HEAD -- src/layouts/Layout.astro`.

## Dependencies

- None

## Success Criteria

- [ ] Contact details and prefilled WhatsApp URL generator are centralized in `src/config/site.ts`.
- [ ] Header includes prominent WhatsApp CTA on desktop and compact quick action on mobile.
- [ ] Floating WhatsApp button renders at bottom-right (`bottom: 1.5rem; right: 1.5rem`) with accessible touch target and pulse animation.
- [ ] Clicking WhatsApp triggers opens WhatsApp chat with prefilled message in a new tab (`target="_blank" rel="noopener noreferrer"`).
