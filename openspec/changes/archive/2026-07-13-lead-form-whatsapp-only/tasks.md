# Tasks for lead-form-whatsapp-only

## Review Workload Forecast

- **Estimated changed lines**: ~100-150 lines
- **400-line budget risk**: Low
- **Chained PRs recommended**: No
- **Suggested split**: Single PR
- **Delivery strategy**: ask-on-risk
- **Chain strategy**: size-exception

```text
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low
```

## Breakdown

### Phase 1: Core Implementation
- [x] **[Task 1.1](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/LeadForm.astro)**: Modify `src/components/LeadForm.astro` to remove email markup, honeypot markup, and their styling.
- [x] **[Task 1.2](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/LeadForm.astro)**: Modify the `<script>` tag in `src/components/LeadForm.astro` to remove email validations, honeypot validations, and API call.
- [x] **[Task 1.3](file:///home/hstrejoluna/Projects/elbuenmaestro/src/components/LeadForm.astro)**: In `src/components/LeadForm.astro`, implement the client-side validation logic and browser redirection to WhatsApp with URL-encoded fields.

### Phase 2: Cleanup & Infrastructure
- [x] **[Task 2.1](file:///home/hstrejoluna/Projects/elbuenmaestro/src/pages/api/lead.ts)**: Delete `src/pages/api/lead.ts`.
- [x] **[Task 2.2](file:///home/hstrejoluna/Projects/elbuenmaestro/test/lead.test.ts)**: Delete `test/lead.test.ts`.
- [x] **[Task 2.3](file:///home/hstrejoluna/Projects/elbuenmaestro/package.json)**: Modify `package.json` to remove the reference to `test/lead.test.ts` from the `test` script.

### Phase 3: Verification & Build
- [x] **Task 3.1**: Run `pnpm typecheck` to verify no TypeScript or Astro type checking errors exist.
- [x] **Task 3.2**: Run `pnpm test` to verify remaining tests pass.
- [x] **Task 3.3**: Run `pnpm build` to verify the build compiles successfully.
