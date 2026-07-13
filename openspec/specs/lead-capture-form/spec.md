# Spec: Lead Capture Form

## Purpose
Provide a secure, spam-resistant contact form to collect client inquiries.

## Requirements
- The form MUST contain inputs for Name, Email, Phone, and Message.
- Client-side validation MUST prevent submission of empty fields or invalid emails.
- A hidden honeypot input field named `email_confirm` MUST be included.
- Submissions MUST be POSTed to `/api/lead` processed server-side in Astro's hybrid rendering mode.
- The server MUST reject requests if the honeypot field is filled.

### Scenarios
- **Happy Path: Valid Submit**
  - **GIVEN** a user fills out the form correctly and the honeypot is empty
  - **WHEN** submit is clicked
  - **THEN** the API processes the lead and returns a `200 OK` status.
- **Edge Case: Bot submission**
  - **GIVEN** a bot fills the hidden honeypot field
  - **WHEN** the form submits POST to `/api/lead`
  - **THEN** the API returns a `200 OK` (deceptive success status) and rejects/drops the lead without notifying the bot of failure.
