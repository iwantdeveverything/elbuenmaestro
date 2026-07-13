# Design for lead-form-whatsapp-only

## Technical Approach
This design details the replacement of the backend email-sending capability with direct client-side redirection to WhatsApp, simplifying communication and increasing potential conversions. The email input and its validation logic are removed from `LeadForm.astro`. Validated form submissions are redirected to WhatsApp with a prefilled, URL-encoded message containing name, phone, location, and description. Unused backend files (`src/pages/api/lead.ts` and `test/lead.test.ts`) are deleted, and the `test` script in `package.json` is updated to omit the deleted integration test.

## Architecture Decisions

### 1. WhatsApp Redirection Target
To prevent browser popup blockers from stopping the submission flow, the redirection will be executed client-side using:
`window.location.href = whatsappUrl;`
This replaces any `window.open` or async POST requests, ensuring a seamless transition to WhatsApp.

### 2. Prefilled Message Format
The WhatsApp message text template is a clean, plain text message formatted as:
```text
Hola, me gustaría solicitar un presupuesto.
*Nombre:* {name}
*Teléfono:* {phone}
*Ubicación:* {location}
*Detalles del proyecto:* {description}
```
All fields are URL-encoded before appending to the base URL `https://wa.me/529984934110?text=`.

### 3. API Route Removal
The serverless route `src/pages/api/lead.ts` is deleted since all data transmission is offloaded to the client redirection.

### 4. Integration Test Removal
The integration test suite in `test/lead.test.ts` is deleted. This test suite verified the serverless API endpoint, which is no longer part of the project.

## File Changes

### [LeadForm.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/LeadForm.astro)
- **Action**: Modify
- **Changes**:
  - Remove the email input group (`<div class="input-group">` for email).
  - Remove the honeypot field (`<div class="honeypot-field">` for email_confirm).
  - Modify the script:
    - Exclude `email` and `email_confirm` processing and validations.
    - Build the prefilled URL-encoded string targeting `https://wa.me/529984934110`.
    - Redirect the page using `window.location.href = url`.
    - Remove the `fetch('/api/lead')` request.

### [package.json](file:///home/hstrejoluna/Projects/elbuenmaestro/package.json)
- **Action**: Modify
- **Changes**:
  - Update the `"test"` script to remove reference to `test/lead.test.ts`.

### [lead.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/src/pages/api/lead.ts)
- **Action**: Delete
- **Changes**: Complete deletion of the serverless API route.

### [lead.test.ts](file:///home/hstrejoluna/Projects/elbuenmaestro/test/lead.test.ts)
- **Action**: Delete
- **Changes**: Complete deletion of the integration test.

## Testing Strategy

### Automated Unit Tests
Run unit tests to ensure that existing utilities remain unaffected:
- Command: `pnpm test` (executes `src/utils/getPageUrl.test.ts` and `src/utils/siloLinking.test.ts` via Node.js native test runner).

### Manual Verification
1. Fill out the form in `LeadForm.astro` with valid details.
2. Intercept or observe the redirection in developer tools.
3. Verify the browser navigates to `https://wa.me/529984934110?text=` with the correctly URL-encoded message format:
   `Hola, me gustaría solicitar un presupuesto.%0A*Nombre:* <name>%0A*Teléfono:* <phone>%0A*Ubicación:* <location>%0A*Detalles del proyecto:* <description>`
4. Confirm client-side validation still blocks submission and displays error messages if Name, Phone, Location, or Description is missing.
