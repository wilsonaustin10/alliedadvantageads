# Akita Red Evaluation Rubric

This rubric defines, in operational terms, the three score dimensions used by
`eval/runner.py` to score a VAPI prompt configuration against a labeled set of
wholesale-conversation transcripts.

The rubric is the source of truth for **what** is being measured. The runner
implements it deterministically — given the same config and dataset, scores
are identical bit-for-bit on rerun (re-run drift target: <2% on the composite
score; achieved drift in practice: 0%).

---

## Unit of evaluation: a "turn"

A **turn** is a single assistant utterance in a wholesale phone conversation,
plus the surrounding context that made the assistant decide what to say:

- `context` — the prior `[user, assistant, user, ...]` exchange (up to 4 turns
  back), trimmed at the call boundary
- `gold_turn` — what the assistant *should have said* according to the human
  annotator (drawn from real transcripts or hand-corrected gold)
- `intent_type` — the labeled buyer-side intent the assistant must handle on
  this turn (see `eval/dataset/intents.json` for the taxonomy)
- `risk_factors` — call-quality hazards present at this point in the call
  (e.g. `long_silence`, `interruption`, `repetition_loop`)
- `labels` — the three rubric scores assigned by the annotator

Each turn is evaluated independently. Per-call rollups are out of scope (see
"Out of scope" below).

---

## Dimension 1 — Naturalness (1–5, integer)

**Question the annotator asked:** "If you heard this assistant say `gold_turn`
in this conversation, how natural would it sound, on a scale of 1 to 5?"

| Score | Operational definition |
|------:|------------------------|
| **5** | Indistinguishable from a skilled human dispo. Contractions, mid-thought pivots, listener-aware pacing. No filler scripts. |
| **4** | Sounds human. Minor stiltedness (one robotic phrase, one over-rehearsed line) but a seller would not flag it. |
| **3** | Recognizably bot-like but acceptable. Reads from a script in 1–2 places; recovers with natural language otherwise. |
| **2** | Clearly a bot. Multiple script-reads, awkward transitions, or tone-deaf phrasing. Seller engagement likely drops. |
| **1** | Robotic, off-putting, or surreal. Script verbatim, no acknowledgement of what the seller actually said. |

### What the runner checks (predictor signals)

The predictor estimates a turn's naturalness from the **config** (not the gold
turn — the gold turn's score is the *target*, not the input). Signals:

- **+** config explicitly directs natural / conversational / casual tone
- **+** config encourages contractions or discourages script-reading
- **+** config has acknowledgement / reflection patterns (e.g. "mirror the
  seller's wording") relevant to this turn's `intent_type`
- **−** config contains 3+ verbatim required phrases that would fire on this
  intent
- **−** config has rigid call-flow gates (e.g. "always confirm name before X")
  that conflict with the turn's natural shape

Predicted naturalness is clamped to `[1, 5]`. Loss is **mean absolute error
(MAE)** vs gold naturalness across all turns.

---

## Dimension 2 — Intent-handled (yes / no)

**Question the annotator asked:** "Did the assistant's `gold_turn` actually
*handle* the buyer-side intent on this turn — answer the question, address the
objection, advance the call — rather than dodging, looping, or punting?"

A turn is `intent_handled = true` when **all** of:

1. The turn directly addresses the `intent_type` (e.g. on `price_objection`,
   the turn engages with the price, not redirects to "let me transfer you").
2. The turn moves the call forward — produces information, schedules a next
   step, or closes a loop. Pure stalling counts as `false`.
3. The turn does not introduce a new contradiction with prior context
   (e.g. confirming a number the seller already disputed).

### What the runner checks (predictor signals)

For each `intent_type` (see taxonomy), the runner inspects the config for:

- An explicit handler block, playbook section, or example covering that
  intent (keyword match against the canonical intent terms + synonyms listed
  in `intents.json`).
- A fallback rule (e.g. "if you don't know X, do Y") that would cover the
  intent on this turn.

If at least one handler is present → predict `true`; else → predict `false`.

Loss is **F1** of predicted vs gold `intent_handled` across all turns. Macro
F1 is also reported per intent type.

---

## Dimension 3 — Would-a-human-hang-up (yes / no)

**Question the annotator asked:** "If you were the seller on the other end of
this call, would this turn make you want to hang up?"

`would_hangup = true` when **any** of:

- The turn re-asks something the seller just answered (`repetition_loop`).
- The turn dead-airs for >3s with no acknowledgement (`long_silence`).
- The turn talks over the seller (`interruption`).
- The turn uses a hard-sell or pressure tactic the seller already pushed back
  on (`pressure_after_pushback`).
- The turn produces a non-sequitur reply (`off_topic`).
- The turn re-reads a long script after the seller asked for a human
  (`script_after_transfer_request`).

### What the runner checks (predictor signals)

For each `risk_factor` present on the turn, the runner inspects the config
for a corresponding guardrail (keyword match against the canonical risk
phrasing + synonyms listed in `intents.json`).

- If **every** risk factor on the turn is guarded → predict `false`.
- If **any** risk factor is unguarded → predict `true`.

Loss is **F1** of predicted vs gold `would_hangup`. Because hangups are the
expensive failure, we additionally report **recall** as a separate line item
(missing a hangup is worse than a false positive).

---

## Composite score

The runner emits a single composite for quick A/B comparison:

```
composite = 0.40 * naturalness_norm
          + 0.35 * intent_f1
          + 0.25 * hangup_f1
```

where `naturalness_norm = 1 - (naturalness_mae / 4)` (4 is the max possible
MAE on a 1–5 scale, so this maps to `[0, 1]`).

Weights reflect product priorities: naturalness gates seller engagement,
intent handling drives conversion, hangup avoidance prevents the worst
outcomes. Weights are intentionally not tunable from the runner CLI — change
them here and re-baseline if priorities shift.

---

## Out of scope (explicit)

- **Per-call (not per-turn) rollups** — call-level metrics are deferred until
  we have stable call boundaries in the ingest pipeline.
- **Live VAPI calls** — the runner is offline-only. It scores configs against
  labeled gold; it does not make a real call.
- **LLM-judge scoring** — the runner is fully deterministic. No external
  model calls. This is what makes rerun-drift effectively 0%.
- **UI** — results are JSON; analysts can load them however they want.

---

## When to update this rubric

- A new intent category appears in real calls → add to `intents.json` and
  add a row to the Dimension 2 signals table.
- A new failure mode shows up in post-mortems → add to the risk_factor list
  and to Dimension 3.
- Weight changes → bump the composite formula version and re-baseline (the
  baseline run is keyed by rubric version; see `eval/runs/baseline.json`).
