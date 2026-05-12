"""Dataset loader: schema validation, labeled/unlabeled handling, ordering."""

from __future__ import annotations

import json
import pathlib

import pytest

from eval.lib.dataset import load_intents, load_turns


def test_loads_real_dataset(dataset_path: pathlib.Path) -> None:
    turns = load_turns(dataset_path)
    assert len(turns) >= 100, f"need at least 100 labeled turns, got {len(turns)}"
    # All labels in valid ranges
    for t in turns:
        assert 1 <= t.naturalness <= 5
        assert isinstance(t.intent_handled, bool)
        assert isinstance(t.would_hangup, bool)


def test_returns_stable_ordering(dataset_path: pathlib.Path) -> None:
    a = [t.turn_id for t in load_turns(dataset_path)]
    b = [t.turn_id for t in load_turns(dataset_path)]
    assert a == b
    assert a == sorted(a)


def test_intents_taxonomy_present(intents_path: pathlib.Path) -> None:
    intents = load_intents(intents_path)
    assert "intents" in intents
    assert "risk_factors" in intents
    assert len(intents["intents"]) >= 10
    assert len(intents["risk_factors"]) >= 5


def test_skips_unlabeled_turns(tmp_path: pathlib.Path) -> None:
    p = tmp_path / "mixed.jsonl"
    rows = [
        {
            "turn_id": "X1", "source": "test", "context": [],
            "gold_turn": "hi", "intent_type": "greeting_and_purpose",
            "risk_factors": [],
            "labels": {"naturalness": 4, "intent_handled": True, "would_hangup": False},
        },
        {
            "turn_id": "X2", "source": "test", "context": [],
            "gold_turn": "hi", "intent_type": "greeting_and_purpose",
            "risk_factors": [], "labels": None, "needs_review": True,
        },
    ]
    with p.open("w") as f:
        for r in rows:
            f.write(json.dumps(r) + "\n")
    loaded = load_turns(p)
    assert [t.turn_id for t in loaded] == ["X1"]


def test_rejects_invalid_naturalness(tmp_path: pathlib.Path) -> None:
    p = tmp_path / "bad.jsonl"
    p.write_text(json.dumps({
        "turn_id": "B1", "source": "test", "context": [],
        "gold_turn": "hi", "intent_type": "greeting_and_purpose",
        "risk_factors": [],
        "labels": {"naturalness": 9, "intent_handled": True, "would_hangup": False},
    }) + "\n")
    with pytest.raises(ValueError, match="naturalness"):
        load_turns(p)


def test_rejects_duplicate_turn_ids(tmp_path: pathlib.Path) -> None:
    p = tmp_path / "dup.jsonl"
    row = {
        "turn_id": "DUP", "source": "test", "context": [],
        "gold_turn": "hi", "intent_type": "greeting_and_purpose",
        "risk_factors": [],
        "labels": {"naturalness": 4, "intent_handled": True, "would_hangup": False},
    }
    with p.open("w") as f:
        f.write(json.dumps(row) + "\n")
        f.write(json.dumps(row) + "\n")
    with pytest.raises(ValueError, match="duplicate turn_id"):
        load_turns(p)


def test_directory_input(tmp_path: pathlib.Path) -> None:
    (tmp_path / "a.jsonl").write_text(json.dumps({
        "turn_id": "A1", "source": "test", "context": [],
        "gold_turn": "hi", "intent_type": "greeting_and_purpose",
        "risk_factors": [],
        "labels": {"naturalness": 4, "intent_handled": True, "would_hangup": False},
    }) + "\n")
    (tmp_path / "b.jsonl").write_text(json.dumps({
        "turn_id": "B1", "source": "test", "context": [],
        "gold_turn": "hi", "intent_type": "greeting_and_purpose",
        "risk_factors": [],
        "labels": {"naturalness": 3, "intent_handled": False, "would_hangup": True},
    }) + "\n")
    turns = load_turns(tmp_path)
    assert sorted(t.turn_id for t in turns) == ["A1", "B1"]
