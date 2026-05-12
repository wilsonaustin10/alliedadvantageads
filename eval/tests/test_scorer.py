"""Scorer: aggregate metrics + composite weighting + per-turn diffs."""

from __future__ import annotations

import pytest

from eval.lib.dataset import Turn
from eval.lib.predictor import TurnPrediction
from eval.lib.scorer import COMPOSITE_WEIGHTS, BinaryMetrics, report_to_dict, score


def _t(turn_id: str, naturalness: int, intent_handled: bool, would_hangup: bool) -> Turn:
    return Turn(
        turn_id=turn_id,
        source="test",
        context=(),
        gold_turn="",
        intent_type="qualify_motivation",
        risk_factors=(),
        naturalness=naturalness,
        intent_handled=intent_handled,
        would_hangup=would_hangup,
        annotator_notes="",
    )


def _p(turn_id: str, naturalness: int, intent_handled: bool, would_hangup: bool) -> TurnPrediction:
    return TurnPrediction(
        turn_id=turn_id,
        predicted_naturalness=naturalness,
        predicted_intent_handled=intent_handled,
        predicted_would_hangup=would_hangup,
        rationale={"naturalness": [], "intent_handled": [], "would_hangup": []},
    )


def test_perfect_predictions() -> None:
    turns = [_t("A", 5, True, False), _t("B", 3, False, True)]
    preds = [_p("A", 5, True, False), _p("B", 3, False, True)]
    r = score(turns, preds)
    assert r.naturalness_mae == 0.0
    assert r.naturalness_norm == 1.0
    assert r.intent.f1 == 1.0
    assert r.hangup.f1 == 1.0
    expected = sum(COMPOSITE_WEIGHTS.values())
    assert pytest.approx(r.composite, abs=1e-6) == expected


def test_naturalness_mae() -> None:
    turns = [_t("A", 5, True, False), _t("B", 1, True, False)]
    preds = [_p("A", 3, True, False), _p("B", 4, True, False)]
    r = score(turns, preds)
    # |5-3| + |1-4| = 5, /2 = 2.5
    assert r.naturalness_mae == 2.5
    assert pytest.approx(r.naturalness_norm) == 1 - (2.5 / 4)


def test_binary_metric_arithmetic() -> None:
    m = BinaryMetrics(tp=3, fp=1, tn=5, fn=1)
    assert m.precision == 0.75
    assert m.recall == 0.75
    assert pytest.approx(m.f1) == 0.75
    assert m.accuracy == 0.8


def test_zero_division_safety() -> None:
    m = BinaryMetrics()
    assert m.precision == 0.0
    assert m.recall == 0.0
    assert m.f1 == 0.0
    assert m.accuracy == 0.0


def test_per_intent_buckets() -> None:
    turns = [
        Turn("A", "x", (), "", "qualify_motivation", (), 4, True, False, ""),
        Turn("B", "x", (), "", "qualify_timeline", (), 4, True, False, ""),
        Turn("C", "x", (), "", "qualify_timeline", (), 4, False, False, ""),
    ]
    preds = [_p("A", 4, True, False), _p("B", 4, True, False), _p("C", 4, True, False)]
    r = score(turns, preds)
    assert set(r.per_intent_f1.keys()) == {"qualify_motivation", "qualify_timeline"}


def test_mismatch_raises() -> None:
    turns = [_t("A", 5, True, False)]
    preds: list = []
    with pytest.raises(ValueError):
        score(turns, preds)


def test_misaligned_turn_id_raises() -> None:
    turns = [_t("A", 5, True, False)]
    preds = [_p("Z", 5, True, False)]
    with pytest.raises(ValueError):
        score(turns, preds)


def test_diff_records_match_flag() -> None:
    turns = [_t("A", 5, True, False), _t("B", 5, True, False)]
    preds = [_p("A", 5, True, False), _p("B", 3, False, True)]
    r = score(turns, preds)
    d_a = next(d for d in r.diffs if d.turn_id == "A")
    d_b = next(d for d in r.diffs if d.turn_id == "B")
    assert d_a.intent_handled_match is True
    assert d_b.intent_handled_match is False
    assert d_b.naturalness_delta == -2


def test_report_to_dict_shape() -> None:
    turns = [_t("A", 5, True, False)]
    preds = [_p("A", 5, True, False)]
    out = report_to_dict(score(turns, preds))
    for key in ("rubric_version", "composite", "naturalness", "intent", "hangup", "per_intent_f1", "per_turn_diffs"):
        assert key in out
