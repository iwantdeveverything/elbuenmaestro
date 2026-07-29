# Interactive Components Spec

## Overview
Specifies interactive visual feedback, loading states, entrance/exit micro-animations, and card hover effects across LeadForm, SiloLinks, and CookieBanner components.

## Requirements

### Requirement: LeadForm Interactive Validation & Button States
The LeadForm component MUST provide visual validation feedback using `:user-valid` and `:user-invalid` pseudo-classes, and submit buttons MUST feature hover shimmer effects and active loading spinner states.

#### Scenario: Real-Time Field Validation
- **Given** a user typing into lead form input fields
- **When** an input field gains focus or loses focus after user interaction
- **Then** valid fields MUST display a subtle valid accent border and invalid fields MUST display a clear warning border using `:user-valid` and `:user-invalid`.

#### Scenario: Form Submission Loading State
- **Given** a user submitting the lead form with valid entries
- **When** form submission is triggered
- **Then** the submit button MUST disable interaction, render a loading spinner state, and animate the success notification banner into view.

### Requirement: SiloLinks Micro-Interactions & Hover Elevation
SiloLinks cards MUST incorporate glassmorphism styling, hardware-accelerated scale/elevation transitions on hover, and pill badge highlight effects.

#### Scenario: Hovering Silo Link Cards
- **Given** a user browsing the SiloLinks section
- **When** the pointer moves over a silo card or pill link
- **Then** the targeted element MUST elevate smoothly via GPU-accelerated transform without layout reflow, highlighting badge icons and link accents.

### Requirement: CookieBanner Entrance and Exit Transitions
The CookieBanner component MUST animate smoothly into view upon mount and transition gracefully offscreen upon user selection.

#### Scenario: Cookie Banner Dismissal
- **Given** a CookieBanner displayed with backdrop blur at the bottom of the viewport
- **When** the user clicks accept or decline
- **Then** the banner MUST execute a CSS slide/opacity exit transition before hidden state completion.
