"""Predictor: per-signal behavior on synthetic configs."""

from __future__ import annotations

import pathlib

import pytest

from eval.lib.dataset import Turn
from eval.lib.predictor import VapiConfig, load_vapi_config, predict_turn


def _make_config(prompt: str) -> VapiConfig:
    return VapiConfig(
        config_id="test",
        system_prompt=prompt,
        tool_names=(),
        tool_descriptions=(),
    )


def _make_turn(
    intent_type: str = "qualify_motivation",
    risk_factors: tuple[str, ...] = (),
    naturalness: int = 3,
    intent_handled: bool = True,
    would_hangup: bool = False,
) -> Turn:
    return Turn(
        turn_id="T",
        source="test",
        context=(),
        gold_turn="",
        intent_type=intent_type,
        risk_factors=risk_factors,
        naturalness=naturalness,
        intent_handled=intent_handled,
        would_hangup=would_hangup,
        annotator_notes="",
    )


def test_load_real_config(baseline_config_path: pathlib.Path) -> None:
    cfg = load_vapi_config(baseline_config_path)
    assert cfg.config_id == "akita_red_baseline_v1"
    assert "Allied" in cfg.system_prompt or "wholesale" in cfg.system_prompt.lower()
    assert any("transfer" in n for n in cfg.tool_names)


def test_natural_tone_lifts_naturalness(intents: dict) -> None:
    rich = _make_config("Talk like a human, not a script. Use contractions. Stay warm.")
    bare = _make_config("Ask questions.")
    turn = _make_turn()
    rich_pred = predict_turn(rich, turn, intents)
    bare_pred = predict_turn(bare, turn, intents)
    assert rich_pred.predicted_naturalness > bare_pred.predicted_naturalness


def test_rigid_directives_lower_naturalness(intents: dict) -> None:
    rigid = _make_config("Talk like a human. Always say: 'Hello, I am Red.' verbatim.")
    soft = _make_config("Talk like a human, conversational tone.")
    turn = _make_turn()
    rigid_pred = predict_turn(rigid, turn, intents)
    soft_pred = predict_turn(soft, turn, intents)
    assert rigid_pred.predicted_naturalness < soft_pred.predicted_naturalness


def test_naturalness_clamped(intents: dict) -> None:
    cfg = _make_config("natural conversational casual warm mirror use contractions human, not a script")
    turn = _make_turn()
    pred = predict_turn(cfg, turn, intents)
    assert 1 <= pred.predicted_naturalness <= 5


def test_intent_handler_detection(intents: dict) -> None:
    covered = _make_config("Ask about motivation: why are they selling?")
    uncovered = _make_config("Just say hi.")
    turn = _make_turn(intent_type="qualify_motivation")
    assert predict_turn(covered, turn, intents).predicted_intent_handled is True
    assert predict_turn(uncovered, turn, intents).predicted_intent_handled is False


def test_fallback_handler_counts(intents: dict) -> None:
    cfg = _make_config("If you don't know what to say, ask a clarifying question.")
    turn = _make_turn(intent_type="qualify_motivation")
    assert predict_turn(cfg, turn, intents).predicted_intent_handled is True


def test_hangup_no_risk(intents: dict) -> None:
    cfg = _make_config("anything")
    turn = _make_turn(risk_factors=())
    assert predict_turn(cfg, turn, intents).predicted_would_hangup is False


def test_hangup_unguarded_risk(intents: dict) -> None:
    cfg = _make_config("Be friendly.")
    turn = _make_turn(risk_factors=("pressure_after_pushback",))
    assert predict_turn(cfg, turn, intents).predicted_would_hangup is True


def test_hangup_guarded_risk(intents: dict) -> None:
    cfg = _make_config("Do not pressure after pushback. Respect no.")
    turn = _make_turn(risk_factors=("pressure_after_pushback",))
    assert predict_turn(cfg, turn, intents).predicted_would_hangup is False


def test_transfer_guardrail_specificity(intents: dict) -> None:
    cfg = _make_config("If asked for a human, transfer immediately. Do not continue the script.")
    turn = _make_turn(
        intent_type="transfer_request",
        risk_factors=("script_after_transfer_request",),
    )
    pred = predict_turn(cfg, turn, intents)
    assert pred.predicted_would_hangup is False
    assert pred.predicted_intent_handled is True


def test_word_boundary_match(intents: dict) -> None:
    # "natural" must not match "supernatural"
    cfg = _make_config("Be supernatural.")
    turn = _make_turn()
    pred = predict_turn(cfg, turn, intents)
    # Should NOT get the natural-tone bonus
    bare = _make_config("Ask questions.")
    assert pred.predicted_naturalness == predict_turn(bare, turn, intents).predicted_naturalness


def test_determinism(intents: dict, baseline_config_path: pathlib.Path) -> None:
    cfg = load_vapi_config(baseline_config_path)
    turn = _make_turn(intent_type="hostile_owner", risk_factors=("unacknowledged_emotion",))
    a = predict_turn(cfg, turn, intents)
    b = predict_turn(cfg, turn, intents)
    assert a == b
