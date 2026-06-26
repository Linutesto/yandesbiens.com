import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// Research feed: posts that belong to a named research track (the substantive
// technical writing), as opposed to meta/announcement posts.
export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft && !!p.data.track)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Éthiqueia — Research',
    description: 'Technical writing across the Éthiqueia research threads: memory systems, cognitive architectures, agent runtimes, commodity training, fractal cognition.',
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
