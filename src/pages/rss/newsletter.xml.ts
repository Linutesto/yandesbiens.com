import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const issues = (await getCollection('newsletter'))
    .filter((i) => !i.data.draft)
    .sort((a, b) => b.data.issue - a.data.issue);
  return rss({
    title: 'Éthiqueia — Newsletter',
    description: 'Every proof drop, in your inbox cadence. Reproducible local-first AI research, no hype.',
    site: context.site ?? 'https://yandesbiens.com',
    items: issues.map((i) => ({
      title: `#${i.data.issue} — ${i.data.title}`,
      description: i.data.description ?? '',
      pubDate: i.data.date,
      link: `/newsletter/${i.id}/`,
      categories: [...(i.data.track ? [i.data.track] : []), ...i.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
