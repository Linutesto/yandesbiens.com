// Canonical research tracks for the Éthiqueia program. Used by the research
// index, blog/newsletter tagging, and RSS. One source of truth.

export type TrackId = 'memory' | 'cognition' | 'agents' | 'training' | 'fractal';

export type Track = {
  id: TrackId;
  label: string;
  blurb: string;
  covers: string[];
  accent: string; // css var name
};

export const tracks: Record<TrackId, Track> = {
  memory: {
    id: 'memory',
    label: 'Memory Systems',
    blurb: 'Self-organizing memory and memory paging — memory that grows, prunes, and pages itself.',
    covers: ['UFM', 'FMM', 'paging', 'self-organizing memory'],
    accent: 'var(--green)',
  },
  cognition: {
    id: 'cognition',
    label: 'Cognitive Architectures',
    blurb: 'Systems that keep reasoning between prompts — internal state, world models, idle cognition.',
    covers: ['NeuroArch', 'AEON', 'world models', 'idle cognition', 'cognitive systems'],
    accent: 'var(--pink)',
  },
  agents: {
    id: 'agents',
    label: 'Agent Runtime Systems',
    blurb: 'Local-first agents whose identity and memory are plain, inspectable files.',
    covers: ['YSON', 'QJSON', 'inspectable state', 'local-first agents'],
    accent: 'var(--amber)',
  },
  training: {
    id: 'training',
    label: 'Commodity Training',
    blurb: 'Training and runtime experiments on a single consumer GPU — raw bytes to trained model.',
    covers: ['ForgeLM', 'byte_gpt', 'single-GPU training'],
    accent: 'var(--pink-soft)',
  },
  fractal: {
    id: 'fractal',
    label: 'Fractal Cognition',
    blurb: 'Self-similar architecture and reasoning — parameter-shared fractal backbones.',
    covers: ['Fractal Neurons', 'FNAS', 'LILA'],
    accent: 'var(--green-dim)',
  },
};

export const trackList: Track[] = Object.values(tracks);
