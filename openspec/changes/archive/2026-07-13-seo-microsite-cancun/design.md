# Design: SEO Local Microsite for Masonry in Cancun

## Technical Approach

We will build the local SEO microsite using Astro with dynamic routing via a single flat root page `src/pages/[slug].astro`. This page will dynamically render both category Hub pages and local Location spoke pages. Metadata, H1, description, and geotags will be managed using Astro Content Collections. We will configure hybrid rendering (`output: 'hybrid'`) via the Vercel adapter, deploying pages as static assets while supporting a secure `/api/lead` serverless API endpoint.

## Architecture Decisions

### Decision: Rendering Model for Lead Form Endpoint

| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **SSG (Static Site Generation)** | Requires client-side JS submitting to third-party endpoints. Exposes API secrets. | Rejected. |
| **Hybrid Rendering (Static + Serverless Endpoint)** | Adds minor cold starts on submit but ensures credentials remain secure on server-side and pages stay ultra-fast. | **Chosen**. Set `output: 'hybrid'` in `astro.config.mjs` with Vercel adapter. |

### Decision: Silo Internal Linking Structure

| Option | Tradeoff | Decision |
| :--- | :--- | :--- |
| **Hardcoded Nav Menus** | Fragile, error-prone, manually intensive to maintain with 49 pages. | Rejected. |
| **Dynamic Silo Linking Generator** | Programmatic filtering of Content Collections based on metadata. Auto-updates links dynamically. | **Chosen**. Set up `src/utils/siloLinking.ts` helper query functions. |

## Data Flow

```
Visitor Submission ──→ [LeadForm.astro] ──(JSON POST)──→ [/api/lead.ts]
                                                           │ (Validation & Honeypot Check)
                                                           └──→ [Resend Email Notification]
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `@astrojs/vercel` and `zod` helper dependencies. |
| `astro.config.mjs` | Modify | Add Vercel adapter configured in `hybrid` output mode. |
| `src/content/config.ts` | Create | Define Content Collection schema for `pages`. |
| `src/content/pages/*.md` | Create | Add markdown files representing 4 hubs and 44 location spokes. |
| `src/pages/[slug].astro` | Create | Handle both hubs and location spokes dynamic rendering. |
| `src/pages/api/lead.ts` | Create | Serverless post endpoint for secure lead capture. |
| `src/components/LeadForm.astro` | Create | Form component featuring honeypot spam protection. |
| `src/utils/siloLinking.ts` | Create | Silo linking query helpers for parent, children, and laterals. |
| `src/components/SiloLinks.astro` | Create | Component to display internal links returned by the utility. |

## Interfaces / Contracts

### Content Collection Schema (`src/content/config.ts`)
```typescript
import { z, defineCollection } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    type: z.enum(['hub', 'spoke']),
    service: z.string(), // e.g. 'albanileria-residencial'
    location: z.string().optional(), // e.g. 'centro'
    parentHub: z.string().optional(), // parent hub slug for spokes
    landmarks: z.array(z.string()).optional(), // local landmarks for SEO
  })
});
```

### Lead Capture API (`/api/lead.ts`)
```typescript
export interface LeadRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string; // Must be empty
  pageSlug: string;
}

export interface LeadResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Silo link builder logic | Test `getSiloLinks` generates correct parent, child, and lateral relationships. |
| Integration | `/api/lead` API validations | Post mock requests verifying honeypot, required inputs, and email trigger. |
| E2E | Page routing & Lead submission | Verify all 49 pages load with 200 OK and form submission functions end-to-end. |

## Migration / Rollout

No migration required.
Rollout will proceed via GitHub Pull Request to `main` with Vercel deployment preview validations.

## Open Questions

- [ ] Will we use Resend or a simple mailer for lead notifications?
