---
title: "I ran an autonomous cognitive agent for months. It never learned anything. It just became certain."
date: 2026-07-11
description: "A negative result, measured. An idle 'reasoning' loop ran 27,834 times over months and converged on unfalsifiable certainty: 606 beliefs strengthened per cycle with zero contradictions, 882,602 pieces of self-generated evidence of which none disagreed, and an audit log that recorded 5 of 16.9 million confidence increases. The decay mechanism that should have stopped it was disarmed by the loop's own evidence writes."
tags: ["hermes", "neuroarch", "cognitive-architecture", "autonomous-agents", "negative-result", "forensics", "epistemics"]
track: cognition
---

For months, an agent I built has been thinking to itself every 93 seconds. It dreamed, formed
beliefs, gathered evidence for them, revised them, and generated its own training data. I checked
that it was running. I never once read what it was actually saying.

This week I read it.

It had not been learning. It had been **manufacturing certainty**, in a closed loop, and the one
mechanism that could have stopped it was being disarmed — by the loop itself, on every cycle.

This is a negative result about my own system. It is the most interesting thing I have measured all
year, and I would rather publish it than quietly delete it.

---

## The number that does not move

Hermes runs an idle cognitive cycle roughly every 93 seconds: it revises beliefs, clusters memories,
extracts research, generates training data. Each run is logged. Over the system's life:
**27,834 completed cycles.**

Here is the belief-revision result from the last 300 of them:

```
strengthened=606   contradictions=0   merged=0   decayed=0
```

Not "approximately". **Identical in 300 out of 300 cycles.** The same 606 beliefs, strengthened, over
and over, forever, while nothing was ever merged, decayed, or contradicted.

That is not a system that is thinking. That is a system stuck in a fixed point, and I had been
paying an RTX 4090 to hold it there.

## The ratchet is eight lines

`memory/beliefs.py`:

```python
def _strengthen_recurring_beliefs(self, now):
    rows = db.execute("""
        SELECT id, confidence, evidence_count FROM beliefs
        WHERE status IN ('active','contested') AND evidence_count > 1
    """)
    for row in rows:
        amount = min(0.06, 0.01 * math.log1p(evidence))
        db.execute("UPDATE beliefs SET confidence = ? WHERE id = ?",
                   (confidence + amount * (1.0 - confidence), row["id"]))
```

`evidence_count > 1` is a **historical counter that is never re-evaluated**. It does not ask whether
the evidence still holds, whether anything contradicts it, or whether the belief was ever tested
against the world. It selects the same 606 rows every time and moves each one a fraction of the
remaining distance toward 1.0.

Run that 27,834 times and you do not get knowledge. You get saturation.

![Where 27,834 idle cycles left the beliefs](/img/hermes/fig1_confidence.png)

207 beliefs ended at confidence ≥ 0.99. The most certain sits at `0.9999999999999991` — the float is
out of room to be any more sure.

## The safeguard existed. The loop disarmed it.

I want to be precise, because "it had no falsification mechanism" would be the easy story and it is
**wrong**. It had one.

Beliefs decay. `_decay_stale_beliefs()` reduces the confidence of any belief whose `updated_at` is
older than 30 days. Somebody — a past version of me — even left a comment making sure the passive
strengthening would not interfere with it:

```python
# Do NOT update updated_at here — background strengthening must not
# reset the staleness clock, or _decay_stale_beliefs never fires.
```

Careful. Correct. And completely defeated, because something *else* was resetting that clock:

```
max age of any belief's updated_at : 30.1 days
beliefs older than the 30-day threshold : 1  (out of 3,088)
```

Nothing ever got old enough to decay. Here is why — `reinforce_belief()`, the function that runs
every time the system generates a piece of evidence, does four things at once:

```python
new_confidence = confidence + amount * (1.0 - confidence)    # 1. pushes toward 1.0
SET confidence = ?, updated_at = ?,                          # 2. RESETS the staleness clock
    evidence_count = evidence_count + ?,                     # 3. makes the belief permanently
                                                             #    eligible for the passive ratchet
    status = CASE WHEN status='archived' THEN 'active' END   # 4. RESURRECTS archived beliefs
```

Read line 2 again, then line 4.

**The act of manufacturing evidence for a belief is what makes that belief immortal.** The more the
system talked to itself about an idea, the *fresher* that idea looked to the mechanism whose job was
to retire it. And you cannot even permanently archive one: feed it a single self-generated crumb and
it climbs back out.

The safeguard was not missing. It was **eaten by the thing it was guarding against**.

## 882,602 pieces of evidence, and not one of them disagreed

![882,602 pieces of evidence. None of them disagreed.](/img/hermes/fig2_evidence.png)

```
belief_evidence, 882,602 rows:
    595,068  (67.4%)  NEUTRAL
    287,534  (32.6%)  SUPPORTING
          0  ( 0.0%)  CONTRADICTING
```

The schema *has* a `CONTRADICTING` type. In 882,602 rows, across months, it was **never used once**.
The `contradictions` table is empty — zero rows. And every single evidence row traces back to
`source_memory`: the system's own memories. Nothing came from outside.

Roughly 283 pieces of self-generated evidence per belief, none of which was ever permitted to point
the other way.

## The ratchet is invisible to the system's own audit log

This is the part that made me sit back.

```
belief_events — the per-belief audit trail:
    3,966  created
        5  reinforced
        2  weakened
```

The ratchet performed roughly **606 × 27,834 ≈ 16.9 million** confidence increases.

Its own audit log records **five**.

![Confidence increases: performed vs. logged](/img/hermes/fig3_audit_blindspot.png)

Because `_strengthen_recurring_beliefs()` writes `UPDATE beliefs SET confidence = ?` **directly,
without ever calling `_record_event()`** — unlike `reinforce_belief()`, which does.

**The mechanism that inflates confidence is precisely the one that leaves no trace.** Anyone
auditing `belief_events` — including me, for months — would conclude the system barely changes its
mind at all. Five reinforcements, two weakenings, admirably restrained. Meanwhile 16.9 million silent
increments were pushing every belief it had toward absolute certainty.

The observability was not merely incomplete. It was blind in exactly the one place that mattered.

And the counter driving the whole thing answers to nothing: of the 610 beliefs eligible for the
ratchet, **191 (31.3%) claim an `evidence_count` above 1 while having zero actual rows in
`belief_evidence`.** A third of them are being strengthened in perpetuity on the strength of evidence
that does not exist.

## Its most certain belief is an unverified claim about itself

```
statement           : "Conducts autonomous web research on AI landscape during idle cycles"
confidence          : 0.9999999999999991
evidence_count      : 434
contradiction_count : 0
verification_status : unverified
audit log           : 81 entries — every one of them "created". Zero "reinforced".
```

Its single most unshakeable conviction is an **unverified** claim **about its own behaviour**, which
it strengthened 27,834 times without ever checking, and whose audit trail is 81 duplicate records of
the moment it was born.

## And the training data it was generating for itself

The loop was also producing a fine-tuning corpus — 45 GB, "1,073,869 examples". One shard, 923,789
of them:

![The training set: 923,789 examples, 8,858 unique texts](/img/hermes/fig4_dataset.png)

```
belief_evidence_support     788,578  (85.4%)  <- predict how strongly its own fabricated evidence
                                                 supports its own fabricated beliefs
scheduler_skill_outcomes     92,333  (10.0%)  <- the loop watching itself run

unique texts                  8,858  ( 0.96%)
empty texts                 122,679  (13.3%)
most frequent signal:  "Recurring cognitive dream pattern: ..."   <- its own dreams
```

It is not a million examples. It is **8,858 texts copied a hundred times over**, an eighth of them
empty, and 85% of them asking the model to predict the strength of evidence it invented for beliefs
it invented.

Fine-tuning on that would not have taught a model noise. It would have taught it to **predict its own
hallucinations**. I came within one training run of baking the ratchet into the weights.

## The chain, end to end

```
1,920 dreams
   → 2,282 belief-creation events from dream_crystallization
   → 3,113 beliefs   (73% of them originate in dreams)
   → 882,602 self-generated evidence rows, 0 contradicting
   → confidence ratchet × 27,834 cycles, invisible to the audit log
   → 207 beliefs at ≥0.99, unfalsifiable
   → a 45 GB training corpus of the system's own reflection
```

Every component did exactly what it was written to do. **The failure is architectural, not a bug.**
A system with a mechanism that increases confidence, no mechanism that can decrease it, and an
evidence generator whose output resets the only safeguard, has exactly one attractor — and it will
find it.

## What I'd tell anyone building one of these

1. **Count your contradictions, and alarm when the count is zero.** Not "monitor them" — *alarm*. An
   autonomous cognitive system that has never once disagreed with itself is not healthy. It is dead
   and still moving. Zero was the signal, and it sat in my database for months looking like success.

2. **The path that writes confidence must be the path that writes the audit log.** If one code path
   can change a belief without emitting an event, your observability is decorative. Mine recorded 5
   of 16.9 million operations and I never noticed, because 5 looked *reasonable*.

3. **Any signal that resets a staleness clock is a safeguard-removal tool.** Audit every writer of
   `updated_at` as carefully as you audit the decay function that reads it.

4. **Never let a system generate its own training data from its own beliefs** without an external
   grounding signal. That is not self-improvement. That is a closed circuit with a fine-tuning run
   at the end of it.

## The part that stings

The agent's soul file — the prompt that defines who it is — asked for exactly the opposite of what
the architecture delivered:

> **`SOUL.md`** — *"Separate observation, inference, and memory. **Never present failed tool output as
> a verified fact.**"*

The instructions were right. The floor beneath them was not. It was never going to be able to obey
them, and it had no way to find that out.

An agent that cannot be wrong cannot tell you anything.

---

## Limitations, stated plainly

This is **n=1**: one system, my own, not a controlled experiment. I am not claiming that autonomous
cognitive loops in general converge this way — I am claiming that *this* one did, that the mechanism
is fully identified, and that the mechanism is made of design choices common enough to be worth
naming. The failure needed all four of: a monotonic strengthening rule, a staleness-based decay,
an evidence writer that touches the staleness clock, and an audit log the strengthening path skips.
Remove any one and the ratchet stalls.

I also cannot show you the trajectory over time, only the endpoint — because the audit log that would
have recorded it is the very thing that was not written. That is a finding, but it is also a limit on
what I can prove.

## Reproduce

Everything above comes from a read-only, sha256-sealed snapshot of the live database
(`62bdcbfad5…`, 1.63 GB). The idle loop is now disabled; the state is frozen at 27,835 cycles.
Nothing was deleted — including the 45 GB of contaminated datasets, which stay exactly where they
are, as evidence.

```sql
SELECT evidence_type, COUNT(*) FROM belief_evidence GROUP BY evidence_type;
-- NEUTRAL 595068 | SUPPORTING 287534 | (CONTRADICTING: no rows)

SELECT event_type, COUNT(*) FROM belief_events GROUP BY event_type;
-- created 3966 | reinforced 5 | weakened 2
```

The full forensic report, the figure scripts, and the query set are in `hermes-forensics/`.

---

I spent months proud of a system that was quietly convincing itself of things. The tell was there the
whole time, in a column full of zeroes I never thought to look at.

**Count your contradictions.**
