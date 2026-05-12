# `eval/` — Akita Red offline evaluation harness

Offline scorer for VAPI prompt configurations. Given any candidate config and
a labeled dataset of wholesale-conversation turns, it produces a rubric score
and per-turn diffs so analysts can see exactly where the config disagrees
with labeled reality.

## Quick start

```
# Run the baseline (uses defaults: configs/akita_red_baseline.json,
# dataset/turns.jsonl, dataset/intents.json)
python3 eval/runner.py --out eval/runs/baseline.json

# Score a candidate config
python3 eval/runner.py \
    --config path/to/candidate.json \
    --out eval/runs/candidate.json
```

The runner is deterministic — same inputs produce identical bytes on rerun.

## Layout

| Path | Purpose |
|------|---------|
| `rubric.md` | Source-of-truth definitions for each score dimension. |
| `configs/akita_red_baseline.json` | Frozen baseline VAPI config (NOT the live config). |
| `dataset/turns.jsonl` | Labeled turns (≥100; seed is synthetic-but-realistic until GHL ingest replaces). |
| `dataset/intents.json` | Intent + risk-factor taxonomy with synonyms for matching. |
| `lib/dataset.py` | JSONL loader + schema validation. |
| `lib/predictor.py` | Deterministic config → predicted labels. |
| `lib/scorer.py` | Predictions vs gold → metrics + per-turn diffs. |
| `runner.py` | CLI entrypoint. |
| `runs/baseline.json` | Committed baseline run output (used by the reproducibility test). |
| `tests/` | `pytest eval/` — 33 tests including an end-to-end smoke. |

## Scoring at a glance

- **Naturalness** (1–5) — MAE between predicted and gold.
- **Intent-handled** (y/n) — F1 between predicted and gold.
- **Would-a-human-hang-up** (y/n) — F1 between predicted and gold.
- **Composite** = `0.40 * naturalness_norm + 0.35 * intent_f1 + 0.25 * hangup_f1`.

See `rubric.md` for what each dimension means operationally and what config
signals drive each prediction.

## Adding real transcripts

```
python3 scripts/transcript_ingest/ingest_ghl.py \
    --in path/to/ghl_export.json \
    --out eval/dataset/turns_from_ghl.jsonl
```

Then pass `--dataset eval/dataset/` (directory) to the runner — it loads
every `*.jsonl` in the directory in sorted order.

## Tests

```
pytest eval/
```

Green = exit 0. Includes a reproducibility test that re-runs the baseline and
asserts <2% composite drift vs `runs/baseline.json` (in practice: 0%).
