import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Yan Desbiens — Éthiqueia',
    description: 'Reproducible local-first AI research. Benchmarks, architectures, and field notes from a one-GPU lab.',
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
