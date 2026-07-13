## Exploration: lead-form-whatsapp-only

### Current State
The project has a contact/lead form (`src/components/LeadForm.astro`) which captures the user's Name, Email, Phone, Location, and Description. It performs client-side validation and sends a POST request to `/api/lead` (defined in `src/pages/api/lead.ts`), which validates the fields (including email) and logs them to the console. Node.js unit tests (`test/lead.test.ts`) assert that valid payloads (with email) succeed and missing fields (like email) return a 400 Bad Request.

### Affected Areas
- `src/components/LeadForm.astro` — Remove the email input field and its frontend validations. Modify the submit handler to redirect the user to WhatsApp after successful form validation/submission.
- `src/pages/api/lead.ts` — Remove the email validation constraint. Continue processing the remaining fields.
- `test/lead.test.ts` — Remove email assertions and update mock payloads to omit the email field.

### Approaches
1. **Approach A: Submit to API, then redirect to WhatsApp** — Client validates the inputs (without email), POSTs to `/api/lead` for server-side logging and audit records, then redirects to WhatsApp using `window.open` or `window.location.href` with a pre-filled, URL-encoded message containing the lead details.
   - Pros: Preserves server-side logs/audit records. Avoids losing lead details if the user fails to complete the WhatsApp redirect. Maintains backend API and test runner coverage. Extremely extensible for future DB/CRM integrations.
   - Cons: Slight latency on form submission due to the API call before triggering the redirection.
   - Effort: Low

2. **Approach B: Direct WhatsApp redirection (Skip API)** — Client validates inputs and redirects to WhatsApp immediately on submit, bypassing the `/api/lead` API post entirely.
   - Pros: Immediate redirection with zero network latency.
   - Cons: No server-side lead logging. The website owner has no backup record if the user doesn't complete the WhatsApp send. The existing `/api/lead` endpoint and its unit tests become obsolete/dead code.
   - Effort: Low

### Recommendation
**Approach A** is highly recommended. It maintains server-side logging which acts as a crucial safety net for lead capture, keeps existing endpoint structures and testing suites valid, and ensures the codebase is prepared for future backend features (such as storing leads in a database or triggering email alerts).

### Risks
- **Redirection Interception/Popup Blockers**: If `window.open` is blocked by browser pop-up blockers, the redirection might fail. Using `window.location.href` instead of `window.open(..., '_blank')` handles the redirection in the same window and is more reliable across mobile browsers.
- **Empty Messages or Abandons**: Users might land on WhatsApp but change or discard the pre-filled message before sending it. Having the server-side log from the API request ensures that we still capture the contact info (Name, Phone, Location, Description) even if the WhatsApp conversation isn't successfully initiated.

### Ready for Proposal
Yes — The orchestrator should proceed to the proposal phase (`sdd-propose`) to draft the specification and design.
