"""Offline eval runner: VAPI config + labeled dataset -> rubric scores + diffs.

Usage
-----
    python3 eval/runner.py \\
        --config eval/configs/akita_red_baseline.json \\
        --dataset eval/dataset/turns.jsonl \\
        --intents eval/dataset/intents.json \\
        --out eval/runs/baseline.json

The runner is fully deterministic — same inputs, same output byte-for-byte.
Re-run drift target per rubric.md is <2% on the composite score; in practice
this implementation is 0%.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys

# Allow running as `python eval/runner.py` from repo root.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))

from eval.lib.dataset import load_intents, load_turns  # noqa: E402
from eval.lib.predictor import load_vapi_config, predict_all  # noqa: E402
from eval.lib.scorer import report_to_dict, score  # noqa: E402


DEFAULT_CONFIG = "eval/configs/akita_red_baseline.json"
DEFAULT_DATASET = "eval/dataset/turns.jsonl"
DEFAULT_INTENTS = "eval/dataset/intents.json"


def run(
    config_path: str | pathlib.Path,
    dataset_path: str | pathlib.Path,
    intents_path: str | pathlib.Path,
    out_path: str | pathlib.Path | None = None,
    include_diffs: bool = True,
) -> dict:
    config = load_vapi_config(config_path)
    intents = load_intents(intents_path)
    turns = load_turns(dataset_path)
    preds = predict_all(config, turns, intents)
    report = score(turns, preds)
    out = {
        "config_id": config.config_id,
        "config_path": str(config_path),
        "dataset_path": str(dataset_path),
        "intents_path": str(intents_path),
        **report_to_dict(report, include_diffs=include_diffs),
    }
    if out_path is not None:
        op = pathlib.Path(out_path)
        op.parent.mkdir(parents=True, exist_ok=True)
        op.write_text(json.dumps(out, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return out


def _format_summary(out: dict) -> str:
    lines = [
        f"config:       {out['config_id']}",
        f"dataset:      {out['dataset_path']} ({out['n_turns']} turns)",
        f"composite:    {out['composite']:.4f}",
        f"naturalness:  mae={out['naturalness']['mae']:.4f}  norm={out['naturalness']['norm']:.4f}",
        f"intent:       f1={out['intent']['f1']:.4f}  p={out['intent']['precision']:.4f}  r={out['intent']['recall']:.4f}",
        f"hangup:       f1={out['hangup']['f1']:.4f}  p={out['hangup']['precision']:.4f}  r={out['hangup']['recall']:.4f}",
    ]
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default=DEFAULT_CONFIG, help="Path to VAPI config JSON")
    parser.add_argument("--dataset", default=DEFAULT_DATASET, help="Path to labeled dataset (JSONL file or dir of *.jsonl)")
    parser.add_argument("--intents", default=DEFAULT_INTENTS, help="Path to intents.json (taxonomy + risk factors)")
    parser.add_argument("--out", default=None, help="Optional path to write the full JSON report")
    parser.add_argument("--no-diffs", action="store_true", help="Omit per-turn diffs from the written report")
    parser.add_argument("--quiet", action="store_true", help="Skip stdout summary")
    args = parser.parse_args(argv)

    out = run(
        config_path=args.config,
        dataset_path=args.dataset,
        intents_path=args.intents,
        out_path=args.out,
        include_diffs=not args.no_diffs,
    )

    if not args.quiet:
        print(_format_summary(out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
