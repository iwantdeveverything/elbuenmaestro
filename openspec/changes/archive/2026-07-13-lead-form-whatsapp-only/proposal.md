# Proposal: lead-form-whatsapp-only

## Intent
Remove the email field from the contact form and redirect form submissions directly to WhatsApp to increase conversions and simplify communication.

## Scope

| Scope | Details |
| :--- | :--- |
| **In Scope** | - Remove `email` input field, validations, and honeypot validation for email from `src/components/LeadForm.astro`<br>- Implement client-side redirection to WhatsApp using the formatted URL `https://wa.me/529984934110?text=...`<br>- Formulate a clean, URL-encoded template text including Name, Phone, Location, and Description<br>- Delete the serverless route `src/pages/api/lead.ts`<br>- Delete the integration test suite in `test/lead.test.ts` |
| **Out of Scope**| - Backend email notifications<br>- Database saving of leads |

## Capabilities

| Capability | Status | Change Description |
| :--- | :--- | :--- |
| `lead-capture-form` | Modified | Requirements change to remove email field and submit via WhatsApp link instead of serverless POST API. |

*No new capabilities are introduced.*

## Approach
- Remove `email` field markup and validations from frontend component.
- Rewrite form submit handler in `LeadForm.astro` to:
  1. Validate remaining fields (Name, Phone, Location, Description).
  2. Build the WhatsApp prefilled message string containing form entries.
  3. Perform redirection on the client-side via `window.location.href`.
- Clean up unused backend code:
  - Delete serverless route `src/pages/api/lead.ts`.
  - Delete integration test suite `test/lead.test.ts`.

## Affected Areas

| Component / Path | Impact | Description |
| :--- | :--- | :--- |
| `src/components/LeadForm.astro` | Modified | Frontend markup and submission logic changes. |
| `src/pages/api/lead.ts` | Removed | Serverless route no longer needed. |
| `test/lead.test.ts` | Removed | Integration test suite no longer needed. |
