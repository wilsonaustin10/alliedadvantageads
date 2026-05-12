"""End-to-end smoke: runner produces a baseline JSON, reproduces within 2%,
and the ingest -> runner pipeline closes on a synthetic GHL export.
"""

from __future__ import annotations

import json
import pathlib
import subprocess
import sys

import pytest

from eval.runner import run

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
BASELINE_RUN = REPO_ROOT / "eval" / "runs" / "baseline.json"


def test_runner_completes_on_real_dataset(
    baseline_config_path: pathlib.Path,
    dataset_path: pathlib.Path,
    intents_path: pathlib.Path,
    tmp_path: pathlib.Path,
) -> None:
    out_path = tmp_path / "run.json"
    out = run(
        config_path=baseline_config_path,
        dataset_path=dataset_path,
        intents_path=intents_path,
        out_path=out_path,
    )
    assert out["n_turns"] >= 100
    assert 0.0 <= out["composite"] <= 1.0
    assert len(out["per_turn_diffs"]) == out["n_turns"]
    assert out_path.exists()


def test_baseline_reproduces_within_2pct(
    baseline_config_path: pathlib.Path,
    dataset_path: pathlib.Path,
    intents_path: pathlib.Path,
    tmp_path: pathlib.Path,
) -> None:
    """Rerun the runner and check drift vs the committed baseline.json."""
    if not BASELINE_RUN.exists():
        pytest.skip("baseline.json not yet generated")

    fresh = run(
        config_path=baseline_config_path,
        dataset_path=dataset_path,
        intents_path=intents_path,
    )
    committed = json.loads(BASELINE_RUN.read_text(encoding="utf-8"))

    # Composite must match within 2 percentage points (rubric target).
    drift = abs(fresh["composite"] - committed["composite"])
    assert drift <= 0.02, f"composite drift {drift:.4f} exceeds 2%"

    # And while we're here — exact determinism on the key aggregates.
    assert fresh["n_turns"] == committed["n_turns"]
    assert fresh["composite"] == committed["composite"]
    assert fresh["naturalness"]["mae"] == committed["naturalness"]["mae"]
    assert fresh["intent"]["f1"] == committed["intent"]["f1"]
    assert fresh["hangup"]["f1"] == committed["hangup"]["f1"]


def test_runner_cli_invocation(
    baseline_config_path: pathlib.Path,
    dataset_path: pathlib.Path,
    intents_path: pathlib.Path,
    tmp_path: pathlib.Path,
) -> None:
    out_path = tmp_path / "cli.json"
    proc = subprocess.run(
        [
            sys.executable,
            str(REPO_ROOT / "eval" / "runner.py"),
            "--config", str(baseline_config_path),
            "--dataset", str(dataset_path),
            "--intents", str(intents_path),
            "--out", str(out_path),
            "--quiet",
        ],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    assert proc.returncode == 0, f"runner CLI failed: {proc.stderr}"
    payload = json.loads(out_path.read_text(encoding="utf-8"))
    assert payload["n_turns"] >= 100


def test_full_pipeline_ingest_to_score(
    baseline_config_path: pathlib.Path,
    intents_path: pathlib.Path,
    tmp_path: pathlib.Path,
) -> None:
    """End-to-end: GHL export -> ingest_ghl.py -> runner.run -> scored report."""
    ghl_export = tmp_path / "ghl_export.json"
    ghl_export.write_text(json.dumps({
        "calls": [
            {
                "id": "call_001",
                "transcript": [
                    {"role": "user", "text": "Hello?"},
                    {"role": "agent", "text": "Hey, Red here — quick one about your place on Maple."},
                    {"role": "user", "text": "Not interested."},
                    {"role": "agent", "text": "No problem at all — taking you off the list."},
                ],
                "labels": [
                    {
                        "turn_index": 1,
                        "naturalness": 5,
                        "intent_handled": True,
                        "would_hangup": False,
                        "intent_type": "greeting_and_purpose",
                        "risk_factors": [],
                        "notes": "warm opener",
                    },
                    {
                        "turn_index": 3,
                        "naturalness": 5,
                        "intent_handled": True,
                        "would_hangup": False,
                        "intent_type": "not_interested",
                        "risk_factors": [],
                        "notes": "graceful DNC",
                    },
                ],
            }
        ]
    }))
    ingested = tmp_path / "from_ghl.jsonl"
    proc = subprocess.run(
        [
            sys.executable,
            str(REPO_ROOT / "scripts" / "transcript_ingest" / "ingest_ghl.py"),
            "--in", str(ghl_export),
            "--out", str(ingested),
        ],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    assert proc.returncode == 0, proc.stderr
    assert ingested.exists() and ingested.stat().st_size > 0

    # Now score the ingested dataset.
    out = run(
        config_path=baseline_config_path,
        dataset_path=ingested,
        intents_path=intents_path,
    )
    assert out["n_turns"] == 2
    assert 0.0 <= out["composite"] <= 1.0


def test_seed_generator_is_byte_stable(tmp_path: pathlib.Path) -> None:
    """Re-running the seed generator must produce identical output."""
    a = tmp_path / "a.jsonl"
    b = tmp_path / "b.jsonl"
    for out in (a, b):
        proc = subprocess.run(
            [
                sys.executable,
                str(REPO_ROOT / "scripts" / "transcript_ingest" / "seed_synthetic.py"),
                "--out", str(out),
            ],
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
        assert proc.returncode == 0, proc.stderr
    assert a.read_bytes() == b.read_bytes()
