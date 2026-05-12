"""Aggregate predictions vs gold labels into rubric scores + per-turn diffs."""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Iterable

from .dataset import Turn
from .predictor import TurnPrediction


# Composite weights from rubric.md, Dimension Composite section.
COMPOSITE_WEIGHTS = {
    "naturalness": 0.40,
    "intent": 0.35,
    "hangup": 0.25,
}
RUBRIC_VERSION = "1.0.0"


@dataclass
class BinaryMetrics:
    tp: int = 0
    fp: int = 0
    tn: int = 0
    fn: int = 0

    @property
    def precision(self) -> float:
        denom = self.tp + self.fp
        return self.tp / denom if denom else 0.0

    @property
    def recall(self) -> float:
        denom = self.tp + self.fn
        return self.tp / denom if denom else 0.0

    @property
    def f1(self) -> float:
        p, r = self.precision, self.recall
        return (2 * p * r / (p + r)) if (p + r) else 0.0

    @property
    def accuracy(self) -> float:
        denom = self.tp + self.fp + self.tn + self.fn
        return (self.tp + self.tn) / denom if denom else 0.0


@dataclass
class TurnDiff:
    turn_id: str
    intent_type: str
    naturalness_gold: int
    naturalness_pred: int
    naturalness_delta: int
    intent_handled_gold: bool
    intent_handled_pred: bool
    intent_handled_match: bool
    would_hangup_gold: bool
    would_hangup_pred: bool
    would_hangup_match: bool
    rationale: dict


@dataclass
class ScoreReport:
    rubric_version: str = RUBRIC_VERSION
    n_turns: int = 0
    naturalness_mae: float = 0.0
    naturalness_norm: float = 0.0
    intent: BinaryMetrics = field(default_factory=BinaryMetrics)
    hangup: BinaryMetrics = field(default_factory=BinaryMetrics)
    per_intent_f1: dict[str, float] = field(default_factory=dict)
    composite: float = 0.0
    diffs: list[TurnDiff] = field(default_factory=list)


def _binary_update(metrics: BinaryMetrics, pred: bool, gold: bool) -> None:
    if pred and gold:
        metrics.tp += 1
    elif pred and not gold:
        metrics.fp += 1
    elif not pred and gold:
        metrics.fn += 1
    else:
        metrics.tn += 1


def score(turns: Iterable[Turn], preds: Iterable[TurnPrediction]) -> ScoreReport:
    turns_list = list(turns)
    preds_list = list(preds)
    if len(turns_list) != len(preds_list):
        raise ValueError(f"turns ({len(turns_list)}) and preds ({len(preds_list)}) mismatch")

    # Align by turn_id — order should already match, but defensive.
    preds_by_id = {p.turn_id: p for p in preds_list}

    report = ScoreReport(n_turns=len(turns_list))
    abs_err_sum = 0

    per_intent_counts: dict[str, BinaryMetrics] = {}

    for turn in turns_list:
        pred = preds_by_id.get(turn.turn_id)
        if pred is None:
            raise ValueError(f"no prediction for turn {turn.turn_id}")

        # naturalness
        delta = pred.predicted_naturalness - turn.naturalness
        abs_err_sum += abs(delta)

        # intent
        _binary_update(report.intent, pred.predicted_intent_handled, turn.intent_handled)
        bucket = per_intent_counts.setdefault(turn.intent_type, BinaryMetrics())
        _binary_update(bucket, pred.predicted_intent_handled, turn.intent_handled)

        # hangup
        _binary_update(report.hangup, pred.predicted_would_hangup, turn.would_hangup)

        report.diffs.append(
            TurnDiff(
                turn_id=turn.turn_id,
                intent_type=turn.intent_type,
                naturalness_gold=turn.naturalness,
                naturalness_pred=pred.predicted_naturalness,
                naturalness_delta=delta,
                intent_handled_gold=turn.intent_handled,
                intent_handled_pred=pred.predicted_intent_handled,
                intent_handled_match=pred.predicted_intent_handled == turn.intent_handled,
                would_hangup_gold=turn.would_hangup,
                would_hangup_pred=pred.predicted_would_hangup,
                would_hangup_match=pred.predicted_would_hangup == turn.would_hangup,
                rationale=pred.rationale,
            )
        )

    report.naturalness_mae = round(abs_err_sum / report.n_turns, 6)
    report.naturalness_norm = round(1.0 - (report.naturalness_mae / 4.0), 6)
    report.per_intent_f1 = {
        intent: round(m.f1, 6)
        for intent, m in sorted(per_intent_counts.items())
    }
    report.composite = round(
        COMPOSITE_WEIGHTS["naturalness"] * report.naturalness_norm
        + COMPOSITE_WEIGHTS["intent"] * report.intent.f1
        + COMPOSITE_WEIGHTS["hangup"] * report.hangup.f1,
        6,
    )
    return report


def report_to_dict(report: ScoreReport, include_diffs: bool = True) -> dict:
    out = {
        "rubric_version": report.rubric_version,
        "n_turns": report.n_turns,
        "composite": report.composite,
        "naturalness": {
            "mae": report.naturalness_mae,
            "norm": report.naturalness_norm,
        },
        "intent": {
            "f1": round(report.intent.f1, 6),
            "precision": round(report.intent.precision, 6),
            "recall": round(report.intent.recall, 6),
            "accuracy": round(report.intent.accuracy, 6),
            "tp": report.intent.tp,
            "fp": report.intent.fp,
            "tn": report.intent.tn,
            "fn": report.intent.fn,
        },
        "hangup": {
            "f1": round(report.hangup.f1, 6),
            "precision": round(report.hangup.precision, 6),
            "recall": round(report.hangup.recall, 6),
            "accuracy": round(report.hangup.accuracy, 6),
            "tp": report.hangup.tp,
            "fp": report.hangup.fp,
            "tn": report.hangup.tn,
            "fn": report.hangup.fn,
        },
        "per_intent_f1": report.per_intent_f1,
    }
    if include_diffs:
        out["per_turn_diffs"] = [asdict(d) for d in report.diffs]
    return out
