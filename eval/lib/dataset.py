"""Dataset loading + validation for the eval harness.

Accepts a single JSONL file or a directory of JSONL files. Unlabeled turns
(``labels: null`` plus ``needs_review: true``) are filtered out — the scorer
only evaluates against labeled turns. Validation errors raise early with a
specific line number so an annotator can fix the dataset rather than the
scorer silently doing something weird.
"""

from __future__ import annotations

import json
import pathlib
from dataclasses import dataclass
from typing import Iterable


REQUIRED_TOP_KEYS = {"turn_id", "context", "gold_turn", "intent_type", "risk_factors", "labels"}
REQUIRED_LABEL_KEYS = {"naturalness", "intent_handled", "would_hangup"}


@dataclass(frozen=True)
class Turn:
    turn_id: str
    source: str
    context: tuple[tuple[str, str], ...]  # (role, text) pairs
    gold_turn: str
    intent_type: str
    risk_factors: tuple[str, ...]
    naturalness: int
    intent_handled: bool
    would_hangup: bool
    annotator_notes: str


def _iter_jsonl(path: pathlib.Path) -> Iterable[tuple[pathlib.Path, int, dict]]:
    if path.is_dir():
        files = sorted(p for p in path.glob("*.jsonl"))
    else:
        files = [path]
    for f in files:
        with f.open("r", encoding="utf-8") as fh:
            for lineno, line in enumerate(fh, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    yield f, lineno, json.loads(line)
                except json.JSONDecodeError as e:
                    raise ValueError(f"{f}:{lineno}: invalid JSON: {e}") from e


def _validate(entry: dict, source: pathlib.Path, lineno: int) -> None:
    missing = REQUIRED_TOP_KEYS - entry.keys()
    if missing:
        raise ValueError(f"{source}:{lineno}: missing required keys: {sorted(missing)}")
    if entry.get("labels") is None:
        return  # caller decides whether to skip
    missing_lbl = REQUIRED_LABEL_KEYS - entry["labels"].keys()
    if missing_lbl:
        raise ValueError(f"{source}:{lineno}: labels missing keys: {sorted(missing_lbl)}")
    n = entry["labels"]["naturalness"]
    if not (isinstance(n, int) and 1 <= n <= 5):
        raise ValueError(f"{source}:{lineno}: naturalness must be int in [1,5], got {n!r}")
    if not isinstance(entry["labels"]["intent_handled"], bool):
        raise ValueError(f"{source}:{lineno}: intent_handled must be bool")
    if not isinstance(entry["labels"]["would_hangup"], bool):
        raise ValueError(f"{source}:{lineno}: would_hangup must be bool")
    if not isinstance(entry["context"], list):
        raise ValueError(f"{source}:{lineno}: context must be a list")
    if not isinstance(entry["risk_factors"], list):
        raise ValueError(f"{source}:{lineno}: risk_factors must be a list")


def load_turns(dataset_path: str | pathlib.Path) -> list[Turn]:
    p = pathlib.Path(dataset_path)
    if not p.exists():
        raise FileNotFoundError(f"dataset path does not exist: {p}")

    turns: list[Turn] = []
    seen_ids: set[str] = set()
    for source, lineno, entry in _iter_jsonl(p):
        _validate(entry, source, lineno)
        if entry.get("labels") is None:
            continue
        if entry["turn_id"] in seen_ids:
            raise ValueError(f"{source}:{lineno}: duplicate turn_id {entry['turn_id']!r}")
        seen_ids.add(entry["turn_id"])
        turns.append(
            Turn(
                turn_id=entry["turn_id"],
                source=entry.get("source", "unknown"),
                context=tuple((c["role"], c["text"]) for c in entry["context"]),
                gold_turn=entry["gold_turn"],
                intent_type=entry["intent_type"],
                risk_factors=tuple(entry["risk_factors"]),
                naturalness=entry["labels"]["naturalness"],
                intent_handled=entry["labels"]["intent_handled"],
                would_hangup=entry["labels"]["would_hangup"],
                annotator_notes=entry.get("annotator_notes", ""),
            )
        )

    if not turns:
        raise ValueError(f"no labeled turns found in {p}")
    # Stable ordering by turn_id so the runner output is deterministic regardless
    # of directory traversal order.
    turns.sort(key=lambda t: t.turn_id)
    return turns


def load_intents(path: str | pathlib.Path) -> dict:
    p = pathlib.Path(path)
    return json.loads(p.read_text(encoding="utf-8"))
