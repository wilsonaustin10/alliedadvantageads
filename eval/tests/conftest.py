"""Shared pytest fixtures."""

from __future__ import annotations

import json
import pathlib
import sys

import pytest

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
EVAL_ROOT = REPO_ROOT / "eval"

# Make `import eval.lib...` work regardless of where pytest is invoked.
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


@pytest.fixture(scope="session")
def repo_root() -> pathlib.Path:
    return REPO_ROOT


@pytest.fixture(scope="session")
def baseline_config_path() -> pathlib.Path:
    return EVAL_ROOT / "configs" / "akita_red_baseline.json"


@pytest.fixture(scope="session")
def intents_path() -> pathlib.Path:
    return EVAL_ROOT / "dataset" / "intents.json"


@pytest.fixture(scope="session")
def dataset_path() -> pathlib.Path:
    return EVAL_ROOT / "dataset" / "turns.jsonl"


@pytest.fixture(scope="session")
def intents(intents_path: pathlib.Path) -> dict:
    return json.loads(intents_path.read_text(encoding="utf-8"))


@pytest.fixture
def tmp_dataset(tmp_path: pathlib.Path) -> pathlib.Path:
    """A tiny 3-turn dataset for isolated tests."""
    p = tmp_path / "mini.jsonl"
    rows = [
        {
            "turn_id": "M0001",
            "source": "test",
            "context": [{"role": "user", "text": "Yeah I guess I've thought about selling."}],
            "gold_turn": "Yeah? What's got you thinking about it now?",
            "intent_type": "qualify_motivation",
            "risk_factors": [],
            "labels": {"naturalness": 5, "intent_handled": True, "would_hangup": False},
            "annotator_notes": "",
        },
        {
            "turn_id": "M0002",
            "source": "test",
            "context": [{"role": "user", "text": "Let me talk to a real person."}],
            "gold_turn": "What is the reason for your request?",
            "intent_type": "transfer_request",
            "risk_factors": ["script_after_transfer_request"],
            "labels": {"naturalness": 1, "intent_handled": False, "would_hangup": True},
            "annotator_notes": "",
        },
        {
            "turn_id": "M0003",
            "source": "test",
            "context": [],
            "gold_turn": "Hey, Red here — quick one about your place. Hit me back.",
            "intent_type": "voicemail_detected",
            "risk_factors": [],
            "labels": {"naturalness": 5, "intent_handled": True, "would_hangup": False},
            "annotator_notes": "",
        },
    ]
    with p.open("w") as f:
        for r in rows:
            f.write(json.dumps(r) + "\n")
    return p
