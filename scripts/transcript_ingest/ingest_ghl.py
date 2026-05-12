"""Ingest a GoHighLevel transcript JSON export into the eval harness schema.

Why this exists
---------------
Akita Red's calls are placed via VAPI and surfaced to operators inside GHL.
GHL exports per-call transcripts as JSON. This script normalizes those exports
into the same per-turn schema used by ``eval/dataset/turns.jsonl`` — one JSONL
line per assistant turn, with surrounding context and (optional) human labels.

Expected GHL export shape
-------------------------
GHL's transcript export varies by integration, so we accept a small union of
shapes. The fields we read from each call JSON:

    {
        "id":                  "<call id>",                    # required
        "transcript": [                                          # required
            {"role": "user"|"assistant"|"system"|"agent",
             "text": "...",
             "timestamp": "..."},
            ...
        ],
        "labels":              [                                # optional
            {"turn_index": 0,
             "naturalness": 4,
             "intent_handled": true,
             "would_hangup": false,
             "intent_type": "qualify_motivation",
             "risk_factors": ["..."],
             "notes": "..."},
            ...
        ]
    }

If ``labels`` is missing, the turns are emitted with ``labels: null`` and a
``needs_review: true`` flag — they're ready for an annotator pass but won't
be used by the scorer until labeled.

Usage
-----
    python3 scripts/transcript_ingest/ingest_ghl.py \\
        --in path/to/ghl_export.json \\
        --out eval/dataset/turns_from_ghl.jsonl

Multiple calls per file are supported (top-level list or
``{"calls": [...]}``). The script is idempotent — re-running on the same
input produces the same output byte-for-byte.
"""

from __future__ import annotations

import argparse
import json
import pathlib
from typing import Any, Iterator

ROLE_NORMALIZE = {
    "user": "user",
    "caller": "user",
    "lead": "user",
    "seller": "user",
    "assistant": "assistant",
    "agent": "assistant",
    "bot": "assistant",
    "ai": "assistant",
    "system": "system",
}


def _normalize_role(raw: str) -> str:
    return ROLE_NORMALIZE.get(raw.lower().strip(), raw.lower().strip())


def _load_calls(in_path: pathlib.Path) -> list[dict[str, Any]]:
    raw = json.loads(in_path.read_text(encoding="utf-8"))
    if isinstance(raw, list):
        return raw
    if isinstance(raw, dict):
        if "calls" in raw and isinstance(raw["calls"], list):
            return raw["calls"]
        # Single-call object
        return [raw]
    raise ValueError(f"Unrecognized GHL export shape at {in_path}: {type(raw).__name__}")


def _context_window(transcript: list[dict[str, Any]], up_to_idx: int, max_back: int = 4) -> list[dict[str, str]]:
    """Return the up to `max_back` prior turns (any role) before `up_to_idx`."""
    start = max(0, up_to_idx - max_back)
    return [
        {"role": _normalize_role(t.get("role", "")), "text": (t.get("text") or "").strip()}
        for t in transcript[start:up_to_idx]
        if (t.get("text") or "").strip()
    ]


def _label_for_turn(labels: list[dict[str, Any]] | None, turn_index: int) -> dict[str, Any] | None:
    if not labels:
        return None
    for lbl in labels:
        if int(lbl.get("turn_index", -1)) == turn_index:
            return lbl
    return None


def iter_turns_from_call(call: dict[str, Any]) -> Iterator[dict[str, Any]]:
    call_id = call.get("id") or call.get("call_id") or "unknown"
    transcript = call.get("transcript") or []
    labels = call.get("labels") or []

    for idx, turn in enumerate(transcript):
        role = _normalize_role(turn.get("role", ""))
        if role != "assistant":
            continue
        text = (turn.get("text") or "").strip()
        if not text:
            continue

        label = _label_for_turn(labels, idx)
        out: dict[str, Any] = {
            "turn_id": f"GHL-{call_id}-{idx:03d}",
            "source": f"ghl:{call_id}",
            "context": _context_window(transcript, idx),
            "gold_turn": text,
            "intent_type": (label or {}).get("intent_type", "unlabeled"),
            "risk_factors": list((label or {}).get("risk_factors", []) or []),
            "labels": (
                {
                    "naturalness": int(label["naturalness"]),
                    "intent_handled": bool(label["intent_handled"]),
                    "would_hangup": bool(label["would_hangup"]),
                }
                if label and all(k in label for k in ("naturalness", "intent_handled", "would_hangup"))
                else None
            ),
            "annotator_notes": (label or {}).get("notes", ""),
        }
        if out["labels"] is None:
            out["needs_review"] = True
        yield out


def ingest(in_path: pathlib.Path, out_path: pathlib.Path) -> tuple[int, int]:
    """Return (turns_written, turns_needing_review)."""
    calls = _load_calls(in_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    written = 0
    needs_review = 0
    with out_path.open("w", encoding="utf-8") as f:
        for call in calls:
            for turn in iter_turns_from_call(call):
                if turn.get("needs_review"):
                    needs_review += 1
                f.write(json.dumps(turn, ensure_ascii=False, sort_keys=True))
                f.write("\n")
                written += 1
    return written, needs_review


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--in", dest="in_path", required=True, help="GHL transcript export JSON")
    parser.add_argument("--out", dest="out_path", required=True, help="Destination JSONL path")
    args = parser.parse_args()

    written, needs_review = ingest(pathlib.Path(args.in_path), pathlib.Path(args.out_path))
    print(f"wrote {written} turns to {args.out_path} ({needs_review} need annotator review)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
