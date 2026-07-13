// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Astro v5+ removed output: 'hybrid'. The default 'static' mode now supports
  // on-demand rendering on a per-page/route basis using: export const prerender = false;
  adapter: vercel()
});
