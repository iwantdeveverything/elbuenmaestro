# Spec: Lead Capture Form

## Purpose
Provide a contact form to collect client inquiries and redirect them to WhatsApp for immediate communication.

## Requirements
- The form MUST contain inputs for Name, Phone, Location (select drop-down), and Description (textarea).
- The form MUST NOT contain an Email input field.
- Client-side validation MUST prevent form submission if any required field (Name, Phone, Location, Description) is empty or invalid.
- Successful form submission MUST redirect the client to WhatsApp via a pre-filled, URL-encoded string targeting number +529984934110.
- The serverless route `/api/lead` and any honeypot filtering MUST be removed.

### Scenarios
- **Happy Path: WhatsApp Redirection**
  - **GIVEN** a user fills out the form correctly (Name, Phone, Location, Description)
  - **WHEN** submit is clicked
  - **THEN** the client validates the fields and redirects the user's browser directly to WhatsApp (`https://wa.me/529984934110?text=...`) with the pre-filled URL-encoded message.
- **Edge Case: Client-side Validation Failure**
  - **GIVEN** a user leaves a required field blank or inputs invalid data
  - **WHEN** submit is clicked
  - **THEN** the form does not redirect and shows inline error messages next to the invalid fields.
