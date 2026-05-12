# `scripts/transcript_ingest/`

Tools for getting wholesale-call transcripts **into** the eval harness. Output
schema: one JSONL line per assistant turn, matching `eval/dataset/turns.jsonl`.

## `seed_synthetic.py`

Generates the seed synthetic-but-realistic dataset. Used until we have enough
labeled real calls. Re-run is byte-stable.

```
python3 scripts/transcript_ingest/seed_synthetic.py
```

Writes to `eval/dataset/turns.jsonl` by default.

## `ingest_ghl.py`

Parses a GoHighLevel transcript JSON export into the same schema. Accepts
single-call, list-of-calls, or `{"calls": [...]}` shapes. Unlabeled turns are
emitted with `labels: null` and `needs_review: true` so an annotator can pick
them up; the scorer ignores unlabeled turns.

```
python3 scripts/transcript_ingest/ingest_ghl.py \
    --in path/to/ghl_export.json \
    --out eval/dataset/turns_from_ghl.jsonl
```

To merge a GHL dump into the canonical dataset, concatenate and dedupe by
`turn_id`. The runner accepts either a single JSONL file or a directory
containing multiple JSONL files.

## Schema (per line)

```json
{
  "turn_id": "T0001",
  "source": "synthetic_seed_v1" | "ghl:<call_id>",
  "context": [{"role": "user"|"assistant", "text": "..."}, ...],
  "gold_turn": "...",
  "intent_type": "qualify_motivation",
  "risk_factors": ["unacknowledged_emotion"],
  "labels": {"naturalness": 4, "intent_handled": true, "would_hangup": false},
  "annotator_notes": "..."
}
```

`labels: null` (plus `needs_review: true`) is permitted for turns awaiting an
annotator pass. The runner skips them.
