import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Static output. The site is fully prerendered for Cloudflare Pages.
// Server bits (chat + newsletter capture) run as Pages Functions in /functions/api/*
// (server-side, keep secrets out of the build) — NOT part of the Astro build.
export default defineConfig({
  site: 'https://yandesbiens.com',
  output: 'static',
  integrations: [react(), sitemap()],
  devToolbar: { enabled: false },
});
