# Specification: Cookie Consent Banner

## 1. Overview
This specification defines the requirements for a non-intrusive bottom-bar cookie consent banner implementing Google Tag Manager (GTM) Consent Mode v2 in basic mode. The banner ensures user privacy preferences are captured, persisted, and propagated before any analytics or advertising tags are executed.

## 2. Requirements

### 2.1 UI Layout
- The cookie consent banner MUST be displayed as a non-intrusive bottom bar.
- The banner MUST provide two clear interaction options:
  - An Accept button labeled "Aceptar"
  - A Reject button labeled "Rechazar"
- The banner MUST display a concise text informing the user about cookie usage and linking to `/politica-cookies`.

### 2.2 Default Behavior (First Load)
- On the first load of the site, before the user interacts with the banner:
  - All GTM consent types (including analytical and advertising storage) MUST default to a denied state.
  - GTM tags MUST NOT run or trigger prior to user consent.
  - The banner MUST be visible.

### 2.3 Consent Decision: Accept
- When the user selects the "Aceptar" option:
  - The consent state for analytical storage and advertising storage MUST be updated to granted.
  - The GTM container is permitted to load and run tags.
  - The user's consent choice MUST be persisted locally (e.g., via browser storage).
  - The banner MUST be hidden immediately.

### 2.4 Consent Decision: Reject
- When the user selects the "Rechazar" option:
  - The consent state for analytical storage and advertising storage MUST remain denied.
  - The GTM container and tags MUST NOT load or execute.
  - The user's consent choice MUST be persisted locally.
  - The banner MUST be hidden immediately.

### 2.5 Subsequent Visits
- If a valid consent decision (Accept or Reject) is already persisted in local storage:
  - The banner MUST NOT be displayed.
  - The persisted consent state MUST be applied immediately on load.

## 3. Scenarios

### Scenario 1: First-time Visit
**Given** a user visits the website for the first time,
**When** the home page loads,
**Then** the default consent state for all analytics and ads storage MUST be set to denied,
**And** no tracking tags MUST execute,
**And** the cookie consent banner MUST be displayed at the bottom of the page.

### Scenario 2: User Accepts Cookies
**Given** the cookie consent banner is visible to the user,
**When** the user clicks the "Aceptar" button,
**Then** the consent state for analytical storage and advertising storage MUST be updated to granted,
**And** the banner MUST hide,
**And** the consent choice MUST be persisted locally.

### Scenario 3: User Rejects Cookies
**Given** the cookie consent banner is visible to the user,
**When** the user clicks the "Rechazar" button,
**Then** the consent state MUST remain denied,
**And** no GTM tracking tags MUST execute,
**And** the banner MUST hide,
**And** the consent choice MUST be persisted locally.

### Scenario 4: Return Visit with Persisted Consent
**Given** a user has previously made a consent choice (either Accept or Reject),
**When** the user loads any page on the site,
**Then** the cookie consent banner MUST NOT be displayed,
**And** the previously persisted consent state MUST be applied.
