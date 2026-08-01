# Tasks: WhatsApp CTAs

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~105 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Complete WhatsApp CTAs and site contact configuration | PR 1 | `npx astro check && npm run build` | `astro dev --background` | Delete `src/config/site.ts`, `src/components/WhatsAppFloating.astro`, revert `src/layouts/Layout.astro` |

## Phase 1: Foundation (Site Contact Configuration)

- [x] 1.1 Create `src/config/site.ts` with phone constants (`PHONE_WHATSAPP = '529984934110'`, `PHONE_DISPLAY = '+52 998 493 4110'`, `PHONE_SCHEMA = '+529984934110'`) and default prefilled message string.
- [x] 1.2 Export `getWhatsAppUrl(message?: string)` utility function in `src/config/site.ts` returning URL-encoded `https://wa.me/` link with default message fallback.

## Phase 2: Core Components (Floating WhatsApp Button)

- [x] 2.1 Create `src/components/WhatsAppFloating.astro` accepting optional `message?: string` prop and referencing `getWhatsAppUrl(message)`.
- [x] 2.2 Add CSS styling in `src/components/WhatsAppFloating.astro` for fixed positioning (`bottom: 1.5rem; right: 1.5rem; z-index: 999`), 56px touch target, brand green (`#25D366`), hover state (`#128C7E`), pulse animation, desktop hover tooltip ("¡Habla con un asesor por WhatsApp!"), and WCAG accessibility attributes (`aria-label="Contactar por WhatsApp"`, `target="_blank"`, `rel="noopener noreferrer"`).

## Phase 3: Integration & Layout (Header CTA & Page Assembly)

- [x] 3.1 Update `src/layouts/Layout.astro` to import contact configuration from `src/config/site.ts` and update footer link/JSON-LD schema phone references.
- [x] 3.2 Add secondary direct WhatsApp action button (`.btn-whatsapp-header`) in `.site-header` alongside primary lead quote button using `getWhatsAppUrl()` with desktop text + icon and mobile compact icon badge.
- [x] 3.3 Embed `<WhatsAppFloating />` component before closing `</body>` tag in `src/layouts/Layout.astro`.

## Phase 4: Verification & Testing

- [x] 4.1 Execute `npx astro check` and `npm run build` to verify zero TypeScript errors and successful production build.
- [x] 4.2 Validate responsive display (desktop side-by-side header CTAs, mobile compact badge, 56px floating target at `bottom: 1.5rem; right: 1.5rem`).
- [x] 4.3 Verify WCAG accessibility (`aria-label`, contrast, focus styles) and WhatsApp URL generation with prefilled text (`target="_blank" rel="noopener noreferrer"`).
