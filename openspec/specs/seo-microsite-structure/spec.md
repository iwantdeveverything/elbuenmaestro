# Spec: SEO Microsite Structure

## Purpose
Define the type-safe structure and navigation siloing for the 49 local SEO pages.

## Requirements
- The site MUST expose exactly 49 pages: Home page (`/`), 4 Service Hubs (e.g., `/albañileria`), and 44 location spokes mapping each hub to 11 locations (e.g., `/albañileria/cancun-centro`).
- Slugs MUST use flat routing: `/[hub]/[location-slug]`.
- Content schemas MUST use Astro Content Collections to ensure type-safe metadata (title, service type, location landmarks).
- Navigation links MUST be generated dynamically using silo routing rules:
  - Downward: Hub pages link to their 11 Spoke (location) pages.
  - Upward: Spoke pages link back to their parent Hub page.
  - Lateral: Spoke pages link to sibling Spokes of the same Hub.

### Scenarios
- **Happy Path: Page Render and Navigation**
  - **GIVEN** a visitor on a Spoke page
  - **WHEN** the page compiles
  - **THEN** it renders links to its parent Hub and adjacent lateral Spokes dynamically.
