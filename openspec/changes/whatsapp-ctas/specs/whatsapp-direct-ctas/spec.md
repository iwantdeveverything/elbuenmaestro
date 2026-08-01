# Specification: WhatsApp Direct CTAs

## Capability: whatsapp-direct-ctas

### 1. Floating WhatsApp Button Requirement
The application MUST provide a standalone floating WhatsApp component (`src/components/WhatsAppFloating.astro`).
- The component MUST render fixed at the bottom-right of the viewport (`bottom: 1.5rem`, `right: 1.5rem`, `z-index: 999`).
- The component MUST feature a brand green background (`#25D366`), dark green hover/focus state (`#128C7E`), and a gentle pulse animation.
- The component MUST maintain a minimum touch target size of 56px by 56px for WCAG mobile accessibility.
- The component MUST display a visible tooltip on desktop hover and focus ("¡Habla con un asesor por WhatsApp!").
- The anchor tag MUST include `target="_blank"` and `rel="noopener noreferrer"`.
- The anchor tag MUST include `aria-label="Contactar por WhatsApp"`.

### 2. Header Direct WhatsApp CTA Requirement
The application MUST provide a colorful WhatsApp action trigger within the header layout.
- Desktop viewports MUST display the WhatsApp icon alongside clear action copy.
- Mobile viewports MUST display a compact, high-contrast WhatsApp action badge.
- Clicking the header CTA MUST generate a direct WhatsApp link using centralized configuration prefilled templates.
- The anchor tag MUST include `target="_blank"` and `rel="noopener noreferrer"`.

---

## Scenarios

### Scenario 1: Floating WhatsApp button positioning and animation
**Given** a user navigates any page on the website  
**When** the viewport is rendered on desktop or mobile  
**Then** the floating WhatsApp button MUST remain fixed at `bottom: 1.5rem` and `right: 1.5rem` with `z-index: 999`  
**And** it MUST display a continuous subtle pulse animation without interfering with scroll performance.

### Scenario 2: Floating button accessibility and touch target size
**Given** a mobile device user or keyboard user interacts with the page  
**When** inspecting the floating WhatsApp button  
**Then** the touch target size MUST measure at least 56px by 56px  
**And** it MUST contain `aria-label="Contactar por WhatsApp"`.

### Scenario 3: Hover tooltip behavior
**Given** a desktop user hovers over or focuses on the floating WhatsApp button  
**When** the hover/focus event triggers  
**Then** a visual tooltip reading "¡Habla con un asesor por WhatsApp!" MUST appear above or beside the button.

### Scenario 4: Header WhatsApp action click navigation
**Given** a user views the website header  
**When** the user clicks the WhatsApp header CTA button  
**Then** the browser MUST open the target WhatsApp URL with prefilled text in a new tab using `target="_blank"` and `rel="noopener noreferrer"`.
