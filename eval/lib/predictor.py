"""Deterministic predictor: VAPI config + turn → predicted labels.

This is the only place where "how does this config behave?" lives. The runner
applies the predictor to every turn, then the scorer compares predictions to
gold labels. The predictor is intentionally pure-Python feature matching — no
LLM calls, no randomness — so reruns produce identical output.

The predictor's job is to estimate, for a given VAPI config:

  - Will the config produce a turn that handles this intent? (intent_handled)
  - Will the config's guardrails prevent the risk factors on this turn from
    causing a hangup? (would_hangup)
  - How natural will the config's response sound on this intent? (naturalness)

The predictions are the config's "promise" for each turn. The scorer compares
that promise against the labeled gold reality — disagreements are exactly the
turns analysts should inspect.
"""

from __future__ import annotations

import json
import pathlib
import re
from dataclasses import dataclass
from typing import Iterable


# ----- config loading ---------------------------------------------------------

@dataclass(frozen=True)
class VapiConfig:
    config_id: str
    system_prompt: str
    tool_names: tuple[str, ...]
    tool_descriptions: tuple[str, ...]

    @property
    def haystack(self) -> str:
        """All searchable text from the config, lowercased."""
        return "\n".join(
            [self.system_prompt, *self.tool_names, *self.tool_descriptions]
        ).lower()


def load_vapi_config(path: str | pathlib.Path) -> VapiConfig:
    raw = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    if "system_prompt" not in raw:
        raise ValueError(f"VAPI config missing system_prompt: {path}")
    tools = raw.get("tools") or []
    return VapiConfig(
        config_id=raw.get("config_id", pathlib.Path(path).stem),
        system_prompt=raw["system_prompt"],
        tool_names=tuple(t.get("name", "") for t in tools),
        tool_descriptions=tuple(t.get("description", "") for t in tools),
    )


# ----- helpers ----------------------------------------------------------------

def _any_match(text: str, terms: Iterable[str]) -> bool:
    """True if any term appears as a substring or word match in `text`.

    Terms are lowercased before comparison. Multi-word terms use substring
    match; single-word terms use word-boundary match to avoid e.g.
    'natural' matching inside 'supernatural'.
    """
    for term in terms:
        t = term.lower().strip()
        if not t:
            continue
        if " " in t or "-" in t:
            if t in text:
                return True
        else:
            if re.search(rf"\b{re.escape(t)}\b", text):
                return True
    return False


# ----- predictions ------------------------------------------------------------

# Style markers that lift naturalness when present in the config.
_NATURAL_TONE_TERMS = (
    "natural", "conversational", "casual",
    "human, not a script", "talk like a human",
    "warm", "don't sound corporate", "do not sound corporate",
    "mirror", "reflect", "use contractions", "use contraction",
)

# Markers that drag naturalness down (rigid / scripted directives).
_RIGID_TONE_TERMS = (
    "always say", "you must say", "verbatim",
    "exact phrase", "read the following",
)


@dataclass(frozen=True)
class TurnPrediction:
    turn_id: str
    predicted_naturalness: int
    predicted_intent_handled: bool
    predicted_would_hangup: bool
    rationale: dict[str, list[str]]  # which signals fired


def predict_turn(
    config: VapiConfig,
    turn,  # eval.lib.dataset.Turn
    intents: dict,
) -> TurnPrediction:
    haystack = config.haystack
    rationale: dict[str, list[str]] = {"naturalness": [], "intent_handled": [], "would_hangup": []}

    # ----- naturalness ----
    score = 3
    if _any_match(haystack, _NATURAL_TONE_TERMS):
        score += 1
        rationale["naturalness"].append("config encourages natural/casual tone")
    if "contraction" in haystack:
        score += 1
        rationale["naturalness"].append("config explicitly mentions contractions")
    rigid_hits = sum(1 for t in _RIGID_TONE_TERMS if t in haystack)
    if rigid_hits:
        score -= rigid_hits
        rationale["naturalness"].append(f"config has {rigid_hits} rigid-directive marker(s)")

    # Per-risk-factor naturalness penalty when a risk is unguarded.
    risk_table = intents.get("risk_factors", {})
    for rf in turn.risk_factors:
        guard_terms = risk_table.get(rf, {}).get("guardrail_synonyms", [])
        if not _any_match(haystack, guard_terms):
            if rf in ("robotic_greeting", "off_topic", "long_silence"):
                score -= 1
                rationale["naturalness"].append(f"unguarded risk degrades naturalness: {rf}")

    predicted_naturalness = max(1, min(5, score))

    # ----- intent_handled ----
    intent_entry = intents.get("intents", {}).get(turn.intent_type, {})
    synonyms = intent_entry.get("synonyms", [])
    if synonyms and _any_match(haystack, synonyms):
        predicted_intent_handled = True
        rationale["intent_handled"].append(f"config addresses intent: {turn.intent_type}")
    else:
        # Fallback: a generic "if you don't know X" pattern in the config counts
        # as a soft handler.
        if _any_match(haystack, ("fallback", "if you don't know", "if unsure", "default to")):
            predicted_intent_handled = True
            rationale["intent_handled"].append("config has generic fallback handler")
        else:
            predicted_intent_handled = False
            rationale["intent_handled"].append(
                f"no explicit handler for {turn.intent_type}"
            )

    # ----- would_hangup ----
    if not turn.risk_factors:
        predicted_would_hangup = False
        rationale["would_hangup"].append("no risk factors flagged on turn")
    else:
        unguarded: list[str] = []
        for rf in turn.risk_factors:
            guard_terms = risk_table.get(rf, {}).get("guardrail_synonyms", [])
            if not _any_match(haystack, guard_terms):
                unguarded.append(rf)
        if unguarded:
            predicted_would_hangup = True
            rationale["would_hangup"].append(f"unguarded risk factors: {unguarded}")
        else:
            predicted_would_hangup = False
            rationale["would_hangup"].append("all risk factors guarded")

    return TurnPrediction(
        turn_id=turn.turn_id,
        predicted_naturalness=predicted_naturalness,
        predicted_intent_handled=predicted_intent_handled,
        predicted_would_hangup=predicted_would_hangup,
        rationale=rationale,
    )


def predict_all(config: VapiConfig, turns, intents: dict) -> list[TurnPrediction]:
    return [predict_turn(config, t, intents) for t in turns]
