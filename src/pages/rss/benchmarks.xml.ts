import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft && p.data.proofDrop)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Éthiqueia — Proof Drops',
    description: 'Formal, reproducible benchmarks from the Éthiqueia research program. Every claim has a one-command repro.',
    site: context.site ?? 'https://yandesbiens.com',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: [...(p.data.track ? [p.data.track] : []), ...p.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
