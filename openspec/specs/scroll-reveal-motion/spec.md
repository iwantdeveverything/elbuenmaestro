# Capability: Scroll Reveal Motion

## Requirement: Scroll-Triggered Section Animations
The application MUST apply scroll-triggered reveal animations to targeted structural sections (`.hero-section`, `.main-article`, `.silo-section`, `.landmarks-box`).

### Scenario: Native CSS scroll-driven reveal animation
Given a browser supporting `@supports (animation-timeline: view())`
When a user scrolls down and a section enters the viewport
Then the section MUST smoothly transition from zero opacity and offset (`opacity: 0`, `transform: translateY(24px)`) to full opacity and original position (`opacity: 1`, `transform: translateY(0)`).

### Scenario: Fallback IntersectionObserver reveal animation
Given a browser that does NOT support native CSS `animation-timeline: view()`
When a user scrolls and a targeted section enters the viewport
Then an `IntersectionObserver` script initialized on `astro:page-load` MUST attach an `.is-visible` class to reveal the section with equivalent CSS transitions.

## Requirement: Accessibility & Reduced Motion Overrides
The application MUST respect the user's `prefers-reduced-motion: reduce` preference by disabling or minimizing view transitions and scroll reveal animations.

### Scenario: User prefers reduced motion
Given a user with system settings configured to `prefers-reduced-motion: reduce`
When navigating between pages or scrolling through section content
Then all view transition durations and scroll animation durations MUST be set to zero or near-instantaneous fades
And transform translations MUST be disabled to prevent spatial disorientation.
