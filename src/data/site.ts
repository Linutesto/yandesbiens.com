// Single source of truth for site identity, SEO, and the brand architecture.
// Yan Desbiens = public face / author. Éthiqueia Québec inc. = lab / publisher / IP.

export const SITE = {
  url: 'https://yandesbiens.com',
  name: 'Yan Desbiens',
  org: 'Éthiqueia Québec inc.',
  orgShort: 'Éthiqueia',
  affiliation: 'Yan Desbiens — Éthiqueia Québec inc., Québec, Canada',
  tagline: 'Reproducible local-first AI research. No hype.',
  description:
    'Independent AI research by Yan Desbiens, conducted at Éthiqueia Québec inc.: self-organizing memory, local-first execution, reproducible benchmarks, and inspectable cognitive systems.',
  defaultOg: '/img/og-default.png',
  // Cloudflare Web Analytics beacon token (cookieless). Leave '' to disable.
  // Get it from: Cloudflare dashboard → Web Analytics → add site → JS snippet token.
  cfAnalyticsToken: '',
  github: 'https://github.com/linutesto',
};
