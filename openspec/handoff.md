# Handoff: Local SEO Microsite for Masonry in Cancun

This document summarizes the current status of the `seo-microsite-cancun` change cycle, the established stacked PRs on GitHub, and the technical recipe to implement Phase 5 (Content Generation).

---

## 1. Current Status & Git Structure

We implemented Phase 1 through 4 using a **stacked-to-main** branch strategy. All changes are committed, pushed, and pull requests have been opened on GitHub:

* **PR #1 (Phase 2 - Routing)**: [phase-2-routing](https://github.com/iwantdeveverything/elbuenmaestro/pull/1) targeting `main`.
  * *Focus*: Content Collections schema (`pages` collection with type-safe metadata) and nested hub/spoke routing via `[...slug].astro`.
* **PR #2 (Phase 3 - Silo Links)**: [phase-3-silo-links](https://github.com/iwantdeveverything/elbuenmaestro/pull/2) targeting `phase-2-routing`.
  * *Focus*: Silo query helper `src/utils/siloLinking.ts` (parent, home, and lateral sibling calculation) and `<SiloLinks />` UI component with native Node unit tests.
* **PR #3 (Phase 4 - Lead Capture)**: [phase-4-lead-capture](https://github.com/iwantdeveverything/elbuenmaestro/pull/3) targeting `phase-3-silo-links`.
  * *Focus*: `<LeadForm />` with off-screen honeypot input (`email_confirm`), and secure serverless POST endpoint `src/pages/api/lead.ts` (`prerender = false`) with testing logic.

---

## 2. Technical Map of Created Files

* `src/content.config.ts`: Defines the `pages` collection using the new Astro v6+ Content Layer API and `glob` loader.
* `src/pages/[...slug].astro`: Rest-parameter router for nested hub/spoke URLs. Generates single-segment hub paths (`/[hub]`) and nested spoke paths (`/[hub]/[location-slug]`) via `getPageUrl()` helper; home served from `index.astro`.
* `src/layouts/Layout.astro`: Premium layout (slate/terracotta/gold theme) with metatags and JSON-LD schema injection.
* `src/utils/siloLinking.ts` & `src/components/SiloLinks.astro`: Automates reciprocal navigation (Hub -> Spoke, Spoke -> Hub, lateral neighbors) to feed search engine indexers with rich, relevant link contexts.
* `src/components/LeadForm.astro` & `src/pages/api/lead.ts`: Secure HTML form + serverless api handler that detects and traps spam bots.
* `test/lead.test.ts` & `src/utils/siloLinking.test.ts`: Complete unit/integration test suites running natively via Node.js test runner (`pnpm test`).
* `.github/workflows/ci.yml`: GitHub Action checking TS validation, formatting, and build status on every PR.

---

## 3. Next Steps: Phase 5 (Content Generation)

To complete the microsite's **49 pages** (1 Home + 4 Hubs + 44 Spokes), you must populate the markdown files under `src/content/pages/`. 

To avoid search engine duplicate content penalties, each of the 44 location spokes **MUST** contain unique context regarding weather, local materials, and local geographical access in Cancun.

### The Recipe for Claude Code / Scripting

Write a Node.js generation script under `scratch/generate-content.js` to systematically output the 44 files:

```javascript
// Example Scratch Generator Skeleton
import fs from 'fs';
import path from 'path';

const locations = [
  { name: 'Zona Hotelera', slug: 'zona-hotelera', landmark: 'Kukulcan Plaza', restriction: 'restricciones de horario para camiones pesados en el bulevar' },
  { name: 'Alfredo V. Bonfil', slug: 'bonfil', landmark: 'Colegio de Bachilleres Bonfil', restriction: 'calles interiores de terracería que dificultan el acceso de camiones mezcladores' },
  { name: 'Centro Cancún', slug: 'centro', landmark: 'Parque de las Palapas', restriction: 'tráfico denso en las avenidas Tulum y Yaxchilán' },
  // ... define all 11 locations
];

const hubs = [
  { id: 'construccion-bardas', service: 'bardas', prefix: 'bardas', h1: 'Construcción de Bardas y Muros', desc: 'muros perimetrales de block' },
  { id: 'remodelacion-acabados', service: 'acabados', prefix: 'acabados', h1: 'Remodelación y Acabados de Albañilería', desc: 'aplanados de yeso y repello' },
  { id: 'pisos-azulejos', service: 'pisos', prefix: 'pisos', h1: 'Instalación de Pisos y Azulejos', desc: 'colocación de porcelanatos' },
  { id: 'reparaciones-estructurales', service: 'reparaciones', prefix: 'reparaciones', h1: 'Reparación de Grietas y Humedades', desc: 'reparación de salitre y filtraciones' }
];

// Generate files: loop hubs x locations to write src/content/pages/${hub.prefix}-${loc.slug}.md
```

Once the files are created, run:
1. `pnpm build` to compile the 49 static pages.
2. Verify route generation and internal links.
