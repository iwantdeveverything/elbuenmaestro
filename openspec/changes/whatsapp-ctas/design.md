# Technical Design: WhatsApp Direct CTAs & Site Contact Configuration

## Technical Approach

This design establishes a centralized contact configuration module and integrates high-converting WhatsApp action triggers across the site. The strategy consists of:
1. **Central Configuration Module (`src/config/site.ts`)**: Exports standardized phone numbers (`PHONE_WHATSAPP`, `PHONE_DISPLAY`, `PHONE_SCHEMA`), default prefilled message strings, and a helper function `getWhatsAppUrl(message?: string)` to generate `https://wa.me/` URLs.
2. **Floating WhatsApp Component (`src/components/WhatsAppFloating.astro`)**: Standalone fixed position button at `bottom: 1.5rem; right: 1.5rem; z-index: 999` with brand green styling (`#25D366`), pulse CSS animation, 56px touch target, desktop tooltip, and complete WCAG accessibility attributes.
3. **Header Integration (`src/layouts/Layout.astro`)**: Replaces hardcoded phone strings with imports from `src/config/site.ts`, adds a secondary direct WhatsApp CTA in `.site-header` alongside the primary lead quote button, and embeds `<WhatsAppFloating />` before the closing `</body>` tag.

## Architecture Decisions

### AD-1: Single Source of Truth for Contact Data
- **Decision**: Centralize all contact phone numbers and messaging generators in `src/config/site.ts`.
- **Rationale**: Prevents phone number drift across JSON-LD schema, footer links, header buttons, and floating CTAs.
- **Alternatives**: Hardcoding numbers in individual components (rejected due to maintenance risk).

### AD-2: Zero-JS Floating Component Implementation
- **Decision**: Use pure Astro and CSS for `WhatsAppFloating.astro` without client-side JavaScript scripts.
- **Rationale**: Guarantees fast hydration, zero main-thread blockage, and optimal Core Web Vitals (INP/LCP). Pulse animations and desktop hover tooltips are handled natively via CSS keyframes and pseudoelements.

### AD-3: Non-Conflicting Viewport Docking Strategy
- **Decision**: Position `WhatsAppFloating` at `bottom: 1.5rem; right: 1.5rem` (`z-index: 999`).
- **Rationale**: Coordinates with existing `GoogleReviewBadge` placed at `bottom: 1.5rem; left: 1.5rem` (`z-index: 99`), ensuring clear visual separation and no UI overlap on mobile screens.

## Data Flow

```mermaid
flowchart LR
    Config["src/config/site.ts"] -->|getWhatsAppUrl()| HeaderCTA["Layout.astro Header CTA"]
    Config -->|getWhatsAppUrl()| FloatingCTA["WhatsAppFloating.astro"]
    Config -->|PHONE_SCHEMA| Schema["Layout.astro JSON-LD Schema"]
    Config -->|PHONE_DISPLAY| Footer["Layout.astro Footer"]
    HeaderCTA -->|target=_blank| WA["https://wa.me/529984934110"]
    FloatingCTA -->|target=_blank| WA
```

1. `src/config/site.ts` evaluates phone constants and standardizes prefilled messages.
2. Components consume `getWhatsAppUrl()` or contact strings.
3. User interaction triggers navigation to WhatsApp API endpoint (`https://wa.me/529984934110?text=...`) in a new browser tab with `rel="noopener noreferrer"`.

## File Changes

| File | Type | Summary |
| --- | --- | --- |
| `src/config/site.ts` | New | Central contact constants (`PHONE_WHATSAPP`, `PHONE_DISPLAY`, `PHONE_SCHEMA`) and `getWhatsAppUrl` generator. |
| `src/components/WhatsAppFloating.astro` | New | Standalone floating button component with pulse animation, desktop tooltip, and accessibility tags. |
| `src/layouts/Layout.astro` | Modified | Import site config, update schema, add header WhatsApp CTA button, and embed `<WhatsAppFloating />`. |

## Interfaces / Contracts

### `src/config/site.ts` Interface
```typescript
export const PHONE_WHATSAPP: string = '529984934110';
export const PHONE_DISPLAY: string = '+52 998 493 4110';
export const PHONE_SCHEMA: string = '+529984934110';

export const DEFAULT_WHATSAPP_MESSAGE: string = 
  'Hola, me gustaría solicitar información y cotización sobre sus servicios de albañilería.';

export function getWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);
  return `https://wa.me/${PHONE_WHATSAPP}?text=${text}`;
}
```

### Component Contracts
- `WhatsAppFloating.astro`: Accepts optional `message?: string` prop. Renders anchor with `target="_blank"`, `rel="noopener noreferrer"`, and `aria-label="Contactar por WhatsApp"`.

## Testing Strategy

1. **Type & Build Verification**: Execute `npx astro check` and `npm run build` to ensure no TypeScript compilation or Astro syntax issues.
2. **Responsive Layout Verification**:
   - Desktop (>=768px): Verify side-by-side header CTAs ("Cotizar Gratis" and "WhatsApp") and desktop tooltip on floating button hover.
   - Mobile (<768px): Verify header WhatsApp CTA collapses into compact icon badge and floating button maintains >=56px touch target without covering bottom elements.
3. **Accessibility Audit**: Confirm proper ARIA labels, focus outline styles, contrast ratio for brand green (`#25D366`), and keyboard navigation accessibility.

## Threat Matrix (N/A)

N/A — This change involves static client-side action links and configuration constants. No user data ingestion, authentication, or backend endpoints are modified.

## Migration Plan

Direct additive deployment:
1. Create `src/config/site.ts` and `src/components/WhatsAppFloating.astro`.
2. Update `src/layouts/Layout.astro`.
3. Validate build output.

**Rollback**: Delete `src/config/site.ts` and `src/components/WhatsAppFloating.astro`, then revert `src/layouts/Layout.astro` (`git checkout HEAD -- src/layouts/Layout.astro`).

## Open Questions

None. All functional and design requirements are fully resolved.
