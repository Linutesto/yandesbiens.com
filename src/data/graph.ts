// Knowledge-graph builder. Derives nodes + edges ONLY from canonical structured
// data (tracks, research threads, publications) so the graph can never drift from
// the program. No inference, no hand-maintained edge list.
import { tracks, type TrackId } from './tracks';
import { threads } from './research';
import { publications } from './publications';

export type GNodeType = 'track' | 'project' | 'publication' | 'repo';

export type GNode = {
  id: string;
  label: string;
  type: GNodeType;
  href?: string;
  track?: TrackId; // for coloring project/pub/repo by thread
};

export type GLink = { source: string; target: string };

export type Graph = { nodes: GNode[]; links: GLink[] };

function repoName(url: string): string {
  const m = url.match(/github\.com\/[^/]+\/([^/]+)/i);
  return m ? m[1] : url;
}

export function buildGraph(): Graph {
  const nodes = new Map<string, GNode>();
  const links: GLink[] = [];
  const add = (n: GNode) => { if (!nodes.has(n.id)) nodes.set(n.id, n); };
  const link = (source: string, target: string) => {
    if (source !== target) links.push({ source, target });
  };

  // Track hubs
  for (const id of Object.keys(tracks) as TrackId[]) {
    add({ id: `track:${id}`, label: tracks[id].label, type: 'track', track: id });
  }

  // Projects + repos, hung off their track
  for (const t of threads) {
    const tNode = `track:${t.track}`;
    for (const p of t.projects) {
      let anchor = tNode;
      if (p.slug) {
        const pid = `project:${p.slug}`;
        add({ id: pid, label: p.name, type: 'project', href: `/projects/${p.slug}/`, track: t.track });
        link(tNode, pid);
        anchor = pid;
      }
      if (p.repo) {
        const rid = `repo:${repoName(p.repo)}`;
        add({ id: rid, label: repoName(p.repo), type: 'repo', href: p.repo, track: t.track });
        link(anchor, rid);
      }
    }
  }

  // Publications, linked to their track + repo
  for (const pub of publications) {
    const pid = `pub:${pub.id}`;
    add({ id: pid, label: pub.shortTitle, type: 'publication', href: pub.url, track: pub.track });
    link(`track:${pub.track}`, pid);
    if (pub.repo) {
      const rid = `repo:${repoName(pub.repo)}`;
      add({ id: rid, label: repoName(pub.repo), type: 'repo', href: pub.repo, track: pub.track });
      link(pid, rid);
    }
  }

  return { nodes: [...nodes.values()], links };
}
