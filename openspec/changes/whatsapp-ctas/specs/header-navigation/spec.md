# Specification: Header Navigation Delta

## Capability: header-navigation

### 1. Dual Header CTA Integration Requirement
The application MUST update `.site-header` in `src/layouts/Layout.astro` to include the direct WhatsApp action alongside the existing lead quote button.
- The header MUST render both the primary lead quote button ("Cotizar ahora") and the secondary WhatsApp CTA.
- The WhatsApp CTA MUST use brand color accents (`#25D366`) to visually distinguish itself from the primary quote button.
- Both action buttons MUST reference centralized contact URLs generated via `src/config/site.ts`.

### 2. Header Layout Responsiveness Requirement
The header action container MUST maintain clean alignment across viewport sizes.
- On desktop viewports, both buttons MUST display full copy and icons side by side.
- On mobile viewports, the WhatsApp CTA MUST collapse to a compact icon badge to prevent layout clipping or overflow.
- Mobile navigation drawer MUST retain smooth access to all primary links and CTAs.

---

## Scenarios

### Scenario 1: Coexistence of WhatsApp CTA and Lead Quote button in Desktop Header
**Given** a user loads the website header on a desktop viewport  
**When** the header action area renders  
**Then** both the "Cotizar now" button and the WhatsApp CTA MUST be visible side by side  
**And** the WhatsApp CTA MUST display distinct brand green styling.

### Scenario 2: Compact mobile header CTA display
**Given** a user loads the website header on a mobile viewport (< 768px)  
**When** the header CTA controls render  
**Then** the WhatsApp action MUST collapse into a compact icon badge  
**And** the layout MUST NOT truncate, wrap, or overlap adjacent menu triggers.
