# Capability: Page View Transitions

## Requirement: Astro ClientRouter Integration
The application MUST integrate `<ClientRouter />` from `astro:transitions` into the `<head>` of `Layout.astro` to enable SPA-style client-side navigation across all pages.

### Scenario: Client-side page navigation
Given a user navigating between pages using internal links
When the user clicks a link targeting another page within the site
Then the navigation MUST execute client-side without a full page reload
And the document title and URL MUST update dynamically.

## Requirement: Root Transition Keyframes and Styles
The CSS stylesheet (`global.css`) MUST declare keyframe animations for `::view-transition-old(root)` and `::view-transition-new(root)` using hardware-accelerated properties (`opacity`, `transform`).

### Scenario: Smooth page transition animation
Given the user triggers a client-side navigation
When the view transition begins
Then the outgoing page view MUST fade out and shift slightly (`opacity: 0`, `transform: translateY(-8px)`)
And the incoming page view MUST fade in and slide up (`opacity: 1`, `transform: translateY(0)`)
And the transition duration MUST NOT exceed 300 milliseconds.

## Requirement: Idempotent Event Listener Re-binding
Interactive component scripts (`Layout.astro`, `LeadForm.astro`, `CookieBanner.astro`) MUST bind their initialization logic to the `astro:page-load` event instead of `DOMContentLoaded` to ensure proper execution across soft navigations.

### Scenario: Component interactivity after soft navigation
Given a user completes a client-side page transition to a page containing `LeadForm` or `CookieBanner`
When the `astro:page-load` event fires
Then component script handlers MUST execute cleanly without duplicate event listener bindings
And interactive controls (e.g. form submission, banner dismiss) MUST remain fully operational.
