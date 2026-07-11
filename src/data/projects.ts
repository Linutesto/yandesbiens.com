export type Project = {
  slug: string;
  name: string;
  tagline: string;
  desc: string; // short — for the card
  body: string[]; // detail-page paragraphs
  highlights: string[]; // detail-page bullets
  stack: string[];
  status: 'live' | 'wip' | 'research';
  featured?: boolean; // gets the live 3D embed
  links?: { label: string; href: string }[]; // repo / docs / related posts
};

export const projects: Project[] = [
  {
    slug: 'neuroarch',
    name: 'NeuroArch',
    tagline: 'a cognitive architecture that runs between prompts',
    desc: 'The lab\'s cognitive-architecture thread: background cognition cycles — idle reasoning, belief recalibration, and memory crystallization — layered on a competent local agent.',
    body: [
      "NeuroArch is the cognitive-architecture direction of the lab: a system that doesn't just answer prompts but keeps reasoning when nobody is watching. Persistent memory, idle cognition, and beliefs that get revised over time.",
      "Under the hood it's a market. Dozens of local models bid on cognitive work, and a router hands tasks to whoever's best for the job. Idle cycles aren't wasted — they go into research, belief recalibration, and a dream phase that crystallizes scattered notes into durable memory.",
      "Where it honestly stands: the underlying agent substrate is already competent today — it reasons, routes, and uses tools well. NeuroArch is the architecture on top — the idle-cognition, belief-recalibration, and dream-crystallization cycles — which it doesn't yet fully run. The research is about giving a capable agent those background cycles and then measuring them, not building competence from scratch.",
      "It's the closest thing I have to a system that's actually alive between conversations — and the next proof needed is to make those cycles measurable: memory growth, belief-revision traces, idle-cycle throughput.",
    ],
    highlights: [
      'Idle cognition — keeps reasoning when nobody is watching',
      'Semantic memory with sentence-transformer retrieval (RAG)',
      'A "cognitive market" routing work across 30+ local models',
      'Dream-cycle crystallization of long-term memory',
      'DuckDB analytics engine + action-outcome learning',
    ],
    stack: ['Python', 'DuckDB', 'Ollama', 'sentence-transformers', 'RAG'],
    status: 'wip',
  },
  {
    slug: 'forgelm',
    name: 'ForgeLM',
    tagline: 'train LLMs on one RTX 4090',
    desc: 'A full local LLM-training stack — 30M to 500M parameter models, end to end, with a web UI.',
    body: [
      "Everyone says you need a datacenter to train a language model. ForgeLM is my answer to that: a complete training stack that fits on a single RTX 4090.",
      "It takes you from raw text to a trained model — tokenizing, training, checkpointing, and evaluating, all driven from a web UI. The point isn't to beat GPT; it's to actually understand what's happening inside, byte by byte, on hardware I can reach out and touch.",
    ],
    highlights: [
      'From-scratch training: 30M → 500M parameter models',
      'Runs entirely on one consumer GPU',
      'Web UI for runs, checkpoints, and evaluation',
      'Full pipeline: tokenize → train → checkpoint → eval',
    ],
    stack: ['PyTorch', 'CUDA', 'Web UI'],
    status: 'live',
  },
  {
    slug: 'aeon',
    name: 'AEON',
    tagline: 'an AI-governed procedural world',
    desc: 'An open-source, deterministic world simulation steered by a local LLM "world-spirit" — with embodied citizens, a teacher-to-student liquid-neural-network mind, and a Three.js dashboard.',
    body: [
      "AEON is a little world that runs itself. A deterministic Python simulation ticks forward, fully reproducible — same seed, same universe. On top of it sits a local LLM I call the world-spirit, nudging events, naming things, and giving the world a sense of intention.",
      "The trick is the balance: the model gets to be creative, but the simulation stays deterministic underneath. You can replay any moment exactly. The visual below is a live taste of that world — rendered right in your browser.",
      "The citizens are becoming embodied: they have positions, pathfinding, and movement intents, they perceive danger and opportunity around them, and their behavior is driven by a continuous-time liquid neural network that a larger teacher model trains through a phased curriculum. It is engineering, not a claim — the emergent behavior is fascinating to watch but not yet formally measured, and I try to say so plainly.",
      "AEON is built in the open. The architecture is written up in a technical whitepaper, and the development log tracks how it actually evolves — including the recent work that traced a trainability bug in the liquid brain to a missing normalization and fixed it. It is the world-model corner of a wider research program; the rigorously benchmarked side lives in UFM and FMM, and the whole map is on the research page.",
    ],
    highlights: [
      'Deterministic, replayable simulation core — same seed, same world',
      'Embodied citizens: positions, pathfinding, movement intents, perception',
      'Teacher-to-student liquid neural network (CfC) with a curriculum',
      'Local LLM "world-spirit" steering events within bounded directives',
      'Believable city placement (collision-free, slope + density aware)',
      'Three.js dashboard, built mobile-first',
    ],
    stack: ['Python', 'FastAPI', 'Three.js', 'Ollama', 'liquid neural nets'],
    status: 'wip',
    featured: true,
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/Linutesto/aeon-living-worlds' },
      { label: 'Technical whitepaper', href: 'https://github.com/Linutesto/aeon-living-worlds/blob/main/WHITEPAPER.md' },
      { label: 'Devlog: stabilizing the liquid brain', href: '/blog/aeon-liquid-brain-stability/' },
    ],
  },
  {
    slug: 'agentos',
    name: 'agentos',
    tagline: 'a cognitive kernel that grew into a self-hosted agent platform',
    desc: 'A terminal-native agent runtime grown into a mobile-first platform: a ReAct loop over 120+ models, ~26 real tools, permission-gated machine access, runtime tool-forging, and a bundled skill library.',
    body: [
      "agentos is the plumbing the rest of my work stands on. It's a small, terminal-native runtime that gives an agent the essentials: a bus of tools it can discover and call, pluggable LLM providers, persistent memory, and a tight event-driven loop.",
      "It has since grown into a full agent platform I run from my phone. One OpenAI-compatible provider puts an entire model catalog — 120+ models — behind a searchable picker, and a ReAct loop lets the agent actually do things: search the web, read and write files, run Python or a shell, analyze images, and roughly twenty other tools. Two modes: a plain streaming chat with the human firmly in the loop, and an agent mode that streams its tool-by-tool reasoning live, with a stop button and a configurable step budget.",
      "Because an agent with real machine access is dangerous, the safety model is the point rather than an afterthought. A permission layer runs every risky action past me — approve or deny, right on the phone — and a filesystem scope fences the agent into a chosen directory. Secrets never touch the source; a hashed, timing-safe PIN guards the door; it runs privately on my own network, not the open internet.",
      "The part I'm fondest of: the agent can extend itself. When no tool fits, it writes a new one as a small JavaScript function that runs in a hardened sandbox and joins its toolset for the session. It also carries a library of ~88 capability guides it can search and follow, and its system prompt is regenerated every turn with live context — the model it's running as, the time of day, its scope, how many tools and skills it holds — so it is genuinely aware of its own environment. This is engineering, not a research claim: the runtime tool-forging sandbox and the skill catalog are adapted from the open-source @framers/agentos project (Apache-2.0); the kernel, the platform, and the safety layer are my own.",
    ],
    highlights: [
      'ReAct agent loop over 120+ models, switchable mid-conversation',
      '~26 real tools: web search/fetch, filesystem, Python/Node/shell runners, vision, memory',
      'Human-in-the-loop permissions: approve/deny each risky action + a filesystem scope',
      'Runtime tool-forging — the agent writes new tools into a hardened node:vm sandbox',
      'Bundled ~88-skill capability library the agent can search and follow',
      'Environment-aware system prompt, regenerated every turn with live state',
      'Hashed-PIN auth, self-hosted, mobile-first — private by default',
    ],
    stack: ['TypeScript', 'Node', 'NVIDIA NIM', 'Cloudflare AI', 'node:vm', 'SSE'],
    status: 'live',
    links: [
      { label: 'Devlog: kernel → agent platform', href: '/blog/agentos-agent-platform/' },
      { label: 'Tool-forging + skills adapted from @framers/agentos', href: 'https://github.com/framerslab/agentos' },
    ],
  },
  {
    slug: 'ufm',
    name: 'UFM',
    tagline: 'run models larger than your VRAM',
    desc: 'Unified Fractal Memory: treat GPU VRAM + CPU RAM as one elastic pool so a single GPU runs models that should not fit. Open source, and benchmarked.',
    body: [
      "UFM treats GPU VRAM and CPU RAM as one elastic pool. It keeps the hot parts of a model on the card, prefetches what's about to be used, and evicts least-recently-used sub-modules when memory gets tight — so a single 4090 can run a model whose footprint exceeds 24 GB.",
      "It's the first piece of the research program to get a formal, reproducible benchmark. On a routed Mixture-of-Experts, the standard all-on-GPU approach OOMs at a 24 GB expert bank; UFM runs the same model holding VRAM at 19.6 GB. When the active working set fits the budget, it does so within ~1% of full-GPU throughput and ~240× faster than naive CPU offloading.",
      "I also published the case where it doesn't help: touch every expert every step and you're transfer-bound, where UFM ties dumb streaming. It's a bet on routing locality, not magic memory — and saying so plainly is the point.",
    ],
    highlights: [
      'Runs a 24 GB expert bank on a 23.5 GB RTX 4090 (baseline OOMs)',
      'Within ~1% of baseline throughput when the working set fits the budget',
      '~240× faster than naive CPU offload (LRU keep-hot caching)',
      'One-command reproducible benchmark + honest failure case',
      'Open source (MIT) — github.com/Linutesto/ufm',
    ],
    stack: ['PyTorch', 'CUDA', 'memory paging', 'MoE'],
    status: 'research',
  },
  {
    slug: 'fractal-neurons',
    name: 'Fractal Neurons',
    tagline: 'an AI that thinks in fractals',
    desc: 'A from-scratch language model built on a fractal backbone — hierarchical memory, quantum-inspired processing, and MoE, trained on a single 4090.',
    body: [
      "Fractal Neurons is the project everything else orbits. Instead of stacking transformer blocks, it aggregates information bottom-up through a parameter-shared f-ary tree — a fractal. The same small set of weights is reused at every level, so the model reaches 65k+ runtime nodes at roughly 70M parameters. Depth and fan-out become knobs instead of cost.",
      "Around that core I built a whole organism: a Fractal Memory Matrix (FMM) that grows and prunes its own nodes, a quantum-inspired processing hook that treats time as a signal, and a local Mixture-of-Experts that only fires the experts it needs. The hard part was never the idea — it was making it fit. So I wrote Unified Fractal Memory, which spans GPU VRAM, pinned RAM, and NVMe as one pool, prefetching and evicting subgraphs so a single card behaves like a mini-cluster.",
      "It's byte-level, so it has no vocabulary to be trapped by — it learns from raw bytes of anything. It ships with a 40-mode control menu, a capacity planner, an autopilot for the 4090, and an agent swarm that generates its own training data. Written alone, at night, in Saguenay. It is the proof that frontier-shaped AI research doesn't require a frontier-sized lab.",
    ],
    highlights: [
      'Parameter-shared fractal backbone — 65k+ runtime nodes at ~70M params',
      'Fractal Memory Matrix (FMM): self-organizing, growing/pruning memory',
      'Unified Fractal Memory (UFM): VRAM + RAM + NVMe as one elastic pool',
      'Byte-level modeling — no fixed vocabulary',
      'Local MoE with top-k routing + load-balance telemetry',
      'Capacity planner, Pareto auto-profiler, and a 4090 autopilot',
    ],
    stack: ['PyTorch', 'CUDA', 'byte-level', 'MoE', 'Ollama'],
    status: 'research',
  },
  {
    slug: 'qjson-agents',
    name: 'QJSON Agents / YSON',
    tagline: 'a local-first agent runtime — and its own file format',
    desc: 'A predictable, inspectable agent runtime with layered memory and RAG — configured in YSON, a human-readable persona format I designed.',
    body: [
      "QJSON Agents is my answer to \"agentic AI\" that turns out to be a cloud wrapper. Everything runs locally and everything is inspectable: an agent is just a persona manifest plus its memory, both stored as files you can open and edit. Its behavior is determined by what you can read, not by a black box.",
      "Memory is layered. A chronological memory.jsonl logs every turn; an event log records forks and swaps; a Fractal Memory store holds structured knowledge; and a retrieval layer with a FAISS-style IVF index does fast semantic recall. Agents can be forked, mutated, and composed into swarms and clusters with real communication topologies.",
      "Personas are written in YSON — a custom configuration format I built because JSON was too noisy for hand-authoring agent identities. The same memory stack later became a drop-in plugin for other agent frameworks.",
    ],
    highlights: [
      'Local-first: personas + memory are plain, inspectable files',
      'Layered memory: JSONL log + event log + FMM + RAG retrieval',
      'FAISS-style IVF index for fast semantic recall',
      'Fork / mutate / swarm — multi-agent topologies',
      'YSON — a hand-authorable persona format of my own design',
    ],
    stack: ['Python', 'Ollama', 'SQLite', 'FAISS', 'YSON'],
    status: 'research',
  },
  {
    slug: 'fnas',
    name: 'FNAS',
    tagline: 'genetic architecture search for fractal models',
    desc: 'Evolves fractal model genomes with a genetic algorithm — search, distill, finetune, and LLM-as-judge scoring, all in one repo.',
    body: [
      "FNAS — Fractal Neural Architecture Search — asks a simple question: if I can't hand-tune the perfect fractal model, can I evolve it? It treats a model's architecture as a genome and runs a genetic algorithm over byte-level language models, breeding and mutating candidates across generations.",
      "It closes the whole loop. It can scrape and distill its own data, train candidate genomes, rank them on a leaderboard, and use a local LLM as an automated judge to score quality — then refine its search around the best genome and keep going, continuously, for as many cycles as you let it. V2 dropped the scraping stack to focus on real corpora and tighter automation.",
    ],
    highlights: [
      'Genetic search over fractal model genomes',
      'LLM-as-judge automated scoring + leaderboard',
      'Self-contained data pipeline: scrape → distill → train',
      'Continuous, resumable multi-cycle search',
      'Curses TUI + CLI for the whole workflow',
    ],
    stack: ['Python', 'genetic algorithms', 'Ollama', 'byte-level'],
    status: 'research',
  },
  {
    slug: 'claude-gpt',
    name: 'claude-gpt',
    tagline: 'an agentic loop over ChatGPT-web',
    desc: 'A terminal agentic loop that drives ChatGPT through the web — prompt reformulation, threading, no API key.',
    body: [
      "claude-gpt came from a simple itch: I wanted an agentic loop, but over the ChatGPT web app instead of a paid API. So I built one.",
      "It threads conversations with prefixes, reformulates each prompt through a compile-and-steer layer before sending, and gives you clean session controls. No keys, no quotas — just the web app, driven like an API.",
    ],
    highlights: [
      'Drives ChatGPT-web as if it were an API — no key required',
      'Prefix-based conversation threading',
      'Reformulation layer that compiles + steers prompts',
      'Clean session controls (/clear, /stop)',
    ],
    stack: ['Python', 'agentic loop', 'automation'],
    status: 'research',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
