# Project Context & Capabilities

This file details the detected capabilities, configuration, and conventions of the `elbuenmaestro` project.

## Project Details
- **Project Name**: `elbuenmaestro`
- **Path**: `/home/hstrejoluna/Projects/elbuenmaestro`
- **Primary Stack**: Astro v7.0.8, TypeScript, Node.js (>=22.12.0)
- **Package Manager**: pnpm

## Development Conventions
- **Development Server**: The local dev server should be run in background mode:
  ```bash
  astro dev --background
  ```
  Management commands:
  - `astro dev stop`
  - `astro dev status`
  - `astro dev logs`
- **Documentation**: Refer to the official [Astro Documentation](https://docs.astro.build).

## Testing Capabilities
- **Framework**: Node.js Test Runner (native)
- **Test Command**: `pnpm test` (runs Node's native test runner with TS strip-types)
- **Typecheck Command**: `pnpm typecheck` (runs Astro check)
- **Strict TDD Mode**: Enabled (`strictTddMode: true`)
