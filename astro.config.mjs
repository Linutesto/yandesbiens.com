import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static output. The site is fully prerendered for Cloudflare Pages.
// The chat demo runs as a Pages Function in /functions/api/chat.ts (server-side,
// keeps the Workers AI token secret) — it is NOT part of the Astro build.
export default defineConfig({
  site: 'https://yandesbiens.com',
  output: 'static',
  integrations: [react()],
  devToolbar: { enabled: false },
});
