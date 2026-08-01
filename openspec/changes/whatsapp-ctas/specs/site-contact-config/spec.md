# Specification: Site Contact Configuration

## Capability: site-contact-config

### 1. Centralized Contact Constants Requirement
The application MUST maintain a single source of truth for contact details in `src/config/site.ts`.
- The file MUST export `PHONE_WHATSAPP` formatted as raw numeric string (`529984934110`).
- The file MUST export `PHONE_DISPLAY` formatted for human reading (`+52 998 493 4110`).
- The file MUST export `PHONE_SCHEMA` formatted for Schema.org JSON-LD compliance (`+529984934110`).
- The file MUST export default prefilled message constants for general inquiries and lead context.

### 2. Prefilled WhatsApp URL Generator Requirement
The application MUST provide a utility function `getWhatsAppUrl(message?: string)` in `src/config/site.ts`.
- The function MUST return a valid `https://wa.me/` link embedding `PHONE_WHATSAPP`.
- When a custom message string is provided, the function MUST URL-encode the string as the `text` query parameter.
- When no message string is provided, the function MUST fallback to the default prefilled inquiry message.

---

## Scenarios

### Scenario 1: Generating standard WhatsApp prefilled chat URL
**Given** a component calls `getWhatsAppUrl()` without custom arguments  
**When** the helper function executes  
**Then** it MUST return `https://wa.me/529984934110?text=` concatenated with the URL-encoded default prefilled message.

### Scenario 2: Generating custom context WhatsApp URL
**Given** a component calls `getWhatsAppUrl("Hola, me interesa una cotización de closet")`  
**When** the helper function executes  
**Then** it MUST return `https://wa.me/529984934110?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20de%20closet`  
**And** the query parameter MUST be properly URL-encoded.

### Scenario 3: Consistency of contact numbers across components
**Given** any site component or schema script requiring contact phone numbers  
**When** importing values from `src/config/site.ts`  
**Then** all components MUST reference `PHONE_WHATSAPP`, `PHONE_DISPLAY`, or `PHONE_SCHEMA` instead of hardcoding phone strings.
