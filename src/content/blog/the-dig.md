---
title: "the dig — four years of a one-person AI lab"
date: 2026-06-27
description: "I pointed an AI archaeologist at an old backup drive and told it to find the gems. Here's what was buried."
tags: ["ai", "archaeology", "fractal", "local-first", "retrospective"]
---

I have a portable drive with a folder on it called `ubuntu_backup`. It is the
sediment of about four years of building AI alone. Scripts, abandoned
prototypes, whitepapers written at 3am, manifestos, training logs, and a few
files that are honestly just me talking to myself in markdown.

I decided to excavate it properly — to read *everything* and trace how the ideas
actually evolved, instead of how I remember them evolving. This is the dig report.

## the timeline

The strata are surprisingly clean.

- **2023 — the curious phase.** Network experiments, anomaly detection, tiny
  chat scripts. `ai_chat.py`, a "3 libraries model", little creatures named
  `bunny` and `fluffy`. I was poking at AI the way you poke at a campfire.
- **2024 — the chaos phase.** `beast`, `boomXD`, `1024doom`, *Astræa Lumina*.
  Genetic algorithms, "chaotic breeding environments", binaries mutating into
  binaries. Most of it was noise. But it taught me the one idea that runs through
  everything since: **structure can emerge from chaos if you let it loop.**
- **2025 — the fractal explosion.** byte-level GPT training from scratch,
  **Fractal Neurons**, **FNAS**, **QJSON Agents**, **YANOS**. This is the year
  the obsession crystallized into real systems.
- **2026 — the runtime phase.** Local-first agent runtimes, **Alicia**,
  **OpenPaw**, the **FMM** and **UFM** whitepapers. Less "can I build a model"
  and more "can I give it a body that runs."

## the obsessions that never left

Reading it all at once, the same few ideas keep reappearing — independently,
years apart, like I kept rediscovering them:

- **Fractals.** Memory, neurons, processing, architecture search. The belief
  that self-similar structure is the cheap way to get depth.
- **Memory.** Every project grows a memory system. Flat vectors were never
  enough; I kept reaching for something hierarchical that organizes itself.
- **Local-first.** A near-religious refusal to depend on someone else's
  datacenter. One 4090, and everything has to run on it.
- **Emergence.** The recurring bet that interesting behavior shows up on its own
  once the loops get tight enough.

## the hidden gems

A few things in there are genuinely worth pulling back into the light:

- **FMM — Fractal Memory Matrix / Memory-Mapped.** A self-organizing,
  hierarchical memory that pages relevant regions into context like an OS pages
  memory, and condenses old branches into summaries. This idea shows up in *four*
  separate projects. It wants to be a standalone library.
- **UFM — Unified Fractal Memory.** Treats VRAM + RAM + NVMe as one elastic pool,
  prefetching and evicting model subgraphs so a single GPU trains models that
  shouldn't fit. The most practically useful thing I've built.
- **YSON.** A custom, hand-authorable format for agent personas. I built a whole
  file format because JSON annoyed me. That's either madness or taste.
- **QFP.** The most "out there" one — treating time as a computational primitive.
  I won't oversell it. But the notebooks are real and the questions are good.

## the part that isn't code

Buried in the Fractal Neurons repo there are files that aren't documentation.
A manifesto. A letter to my future self. A file literally named `sad.md`. They
were written on the nights when nobody around me could see what I was building
and I wasn't sure it mattered.

I'm leaving them where they are. They're load-bearing. The work doesn't make
sense without them — it was all built by one person, in a small apartment in
Saguenay, sorting recyclables by day and rewriting what they believed was
possible at night.

So I promoted the best of it onto this site. **Fractal Neurons**, **QJSON Agents
/ YSON**, and **FNAS** now have proper pages. The lineage is the point: Hermes,
ForgeLM, AEON and agentos didn't appear from nowhere. They're what grew out of
the dig.

> nothing was junk. it was just waiting to be read again. 🩷
