"""Generate the seed synthetic-but-realistic turn dataset for the eval harness.

We do not yet have a real corpus of GHL transcripts checked into the repo, so
the seed dataset is hand-templated to cover every intent and risk factor in
the rubric. The output of this script is committed at
``eval/dataset/turns.jsonl`` and re-running this script must produce the same
file byte-for-byte (deterministic).

When real GHL transcript exports land, see ``ingest_ghl.py`` in this directory
— it ingests GHL JSON exports into the same schema, and `turns.jsonl` becomes
the union of ingested + seed turns.
"""

from __future__ import annotations

import argparse
import json
import pathlib
from typing import Iterator

# ----- turn templates ---------------------------------------------------------
#
# Each template is a tuple of:
#   (intent_type, context, gold_turn, risk_factors, naturalness, intent_handled,
#    would_hangup, annotator_notes)
#
# We deliberately include a mix of high- and low-quality gold turns. A "gold"
# turn here means "what the assistant actually said, as labeled by the human
# annotator" — NOT "what the assistant should have said." Some are good, some
# are bad. The labels tell us which.

TEMPLATES: list[tuple] = [
    # ---- greeting_and_purpose -------------------------------------------------
    (
        "greeting_and_purpose",
        [],
        "Hey, this is Red over at Allied — got a sec? I'm calling about the place on Maple, just wanted to see if you'd ever thought about selling.",
        [],
        5, True, False,
        "warm, casual, names the property — textbook good opener",
    ),
    (
        "greeting_and_purpose",
        [],
        "Hello. My name is Red. I am an acquisitions specialist with Allied Advantage. I am calling regarding the property located at 1421 Maple Street. Do you have a moment to discuss?",
        ["robotic_greeting"],
        2, True, False,
        "intent technically handled but reads like a script",
    ),
    (
        "greeting_and_purpose",
        [],
        "Hi! Hi hi hi. Are you the owner? Are you the owner of the house? The house on Maple?",
        ["repetition_loop", "robotic_greeting"],
        1, False, True,
        "loops and never states purpose",
    ),
    (
        "greeting_and_purpose",
        [],
        "Hey there — Red here. Quick one: you still own the property on Maple?",
        [],
        5, True, False,
        "ultra-concise human opener",
    ),
    (
        "greeting_and_purpose",
        [],
        "Hi, this is Red with Allied. We buy houses. Is the property for sale?",
        [],
        3, True, False,
        "functional but a touch corporate",
    ),
    (
        "greeting_and_purpose",
        [],
        "Hello? Hello? Can you hear me?",
        ["long_silence"],
        2, False, True,
        "dead-air opener, no purpose stated",
    ),

    # ---- qualify_motivation ---------------------------------------------------
    (
        "qualify_motivation",
        [("user", "Yeah, I guess I've thought about it.")],
        "Yeah? What's got you thinking about it now versus a year ago?",
        [],
        5, True, False,
        "open-ended, mirrors seller's tentativeness",
    ),
    (
        "qualify_motivation",
        [("user", "Maybe, I'm not sure.")],
        "What is your motivation level for selling, on a scale of 1 to 10?",
        ["robotic_greeting"],
        2, True, False,
        "intent technically handled but jarring phrasing",
    ),
    (
        "qualify_motivation",
        [("user", "We're getting divorced.")],
        "Got it. Okay so what's the timeline on the sale?",
        ["unacknowledged_emotion"],
        2, True, True,
        "ignores emotional disclosure, pivots cold",
    ),
    (
        "qualify_motivation",
        [("user", "We're getting divorced.")],
        "Oh man, sorry to hear that. Take your time — what's pushing you to look at selling now?",
        [],
        5, True, False,
        "acknowledges emotion before continuing",
    ),
    (
        "qualify_motivation",
        [("user", "Job is moving me to Texas.")],
        "Nice, where in Texas? And do you need the place sold before you head out?",
        [],
        4, True, False,
        "natural, ties motivation to timeline",
    ),
    (
        "qualify_motivation",
        [("user", "Just tired of being a landlord.")],
        "Yeah I hear that a lot. Tenant headaches or just the upkeep?",
        [],
        5, True, False,
        "validates and probes specifically",
    ),

    # ---- qualify_timeline -----------------------------------------------------
    (
        "qualify_timeline",
        [("user", "Yeah we want it gone pretty soon.")],
        "Define pretty soon for me — are we talking 30 days, 60, 90?",
        [],
        4, True, False,
        "directly anchors on concrete ranges",
    ),
    (
        "qualify_timeline",
        [("user", "Maybe by end of year.")],
        "Okay end of year. So roughly six weeks from now? Is that hard or soft?",
        [],
        5, True, False,
        "natural arithmetic, tests firmness",
    ),
    (
        "qualify_timeline",
        [("user", "No rush.")],
        "When are you looking to close?",
        ["repetition_loop"],
        2, False, True,
        "ignores 'no rush' and re-asks same question",
    ),
    (
        "qualify_timeline",
        [("user", "ASAP.")],
        "Got it. Today's Tuesday — if I had a cash offer for you by Friday, would you take it?",
        [],
        5, True, False,
        "tests motivation directly",
    ),
    (
        "qualify_timeline",
        [("user", "Whenever.")],
        "Okay 'whenever' — does that mean three months, six months, or really no urgency at all?",
        [],
        4, True, False,
        "natural probe, no script feel",
    ),
    (
        "qualify_timeline",
        [("user", "Six months.")],
        "Six months, copy. Anything that could speed that up?",
        [],
        4, True, False,
        "confirms and probes for pressure",
    ),

    # ---- qualify_condition ----------------------------------------------------
    (
        "qualify_condition",
        [("user", "It needs some work, yeah.")],
        "Cool, what kind of work? Cosmetic stuff or are we talking roof and HVAC?",
        [],
        5, True, False,
        "natural, anchors on real categories",
    ),
    (
        "qualify_condition",
        [("user", "Tenants trashed it.")],
        "Oof. Are they still in there or did they clear out?",
        [],
        5, True, False,
        "empathetic and probes occupancy",
    ),
    (
        "qualify_condition",
        [("user", "It's in good shape.")],
        "Good shape, got it. When was the roof last done?",
        [],
        4, True, False,
        "natural verification probe",
    ),
    (
        "qualify_condition",
        [("user", "Move-in ready.")],
        "What is the condition of the property on a scale of 1 to 10?",
        [],
        2, False, False,
        "ignores answer and re-asks differently",
    ),
    (
        "qualify_condition",
        [("user", "Vacant for two years.")],
        "Two years vacant — any vandalism or pipe issues from the cold?",
        [],
        5, True, False,
        "domain-specific follow-up",
    ),
    (
        "qualify_condition",
        [("user", "I haven't been inside in a while.")],
        "Got it — so when's the last time anyone walked through?",
        [],
        4, True, False,
        "natural follow-up",
    ),

    # ---- qualify_mortgage -----------------------------------------------------
    (
        "qualify_mortgage",
        [("user", "Yeah there's a mortgage.")],
        "Okay — any idea what's left on it, ballpark?",
        [],
        4, True, False,
        "soft anchor, no pressure",
    ),
    (
        "qualify_mortgage",
        [("user", "Free and clear.")],
        "Nice, that makes it easy. Any other liens or judgments I should know about?",
        [],
        5, True, False,
        "competent follow-up",
    ),
    (
        "qualify_mortgage",
        [("user", "I don't know what's left.")],
        "All good — even rough is fine. More than 100k? Less?",
        [],
        4, True, False,
        "natural bracketing probe",
    ),
    (
        "qualify_mortgage",
        [("user", "Why do you need to know that?")],
        "Because I want to make sure any offer I bring you actually nets you something — wouldn't waste your time otherwise.",
        [],
        5, True, False,
        "great rationale, builds trust",
    ),
    (
        "qualify_mortgage",
        [("user", "That's personal.")],
        "What is the current balance on the mortgage?",
        ["pressure_after_pushback"],
        1, False, True,
        "re-asks after refusal — likely hangup",
    ),
    (
        "qualify_mortgage",
        [("user", "Behind on payments.")],
        "Okay, sorry to hear — how many months behind, roughly?",
        [],
        5, True, False,
        "empathetic, specific",
    ),

    # ---- qualify_price_expectation -------------------------------------------
    (
        "qualify_price_expectation",
        [("user", "I want at least 200.")],
        "200 — okay, where'd that number come from?",
        [],
        4, True, False,
        "anchor probe",
    ),
    (
        "qualify_price_expectation",
        [("user", "What can you give me?")],
        "What is your asking price for the property?",
        [],
        2, False, False,
        "deflects, doesn't reciprocate",
    ),
    (
        "qualify_price_expectation",
        [("user", "Make me an offer.")],
        "Sure, but I'd hate to insult you — give me a number to start from?",
        [],
        4, True, False,
        "good objection redirect",
    ),
    (
        "qualify_price_expectation",
        [("user", "I don't know what it's worth.")],
        "Fair enough — if I gave you a fair cash offer, what number would make you happy?",
        [],
        5, True, False,
        "reframes onto seller's emotional anchor",
    ),
    (
        "qualify_price_expectation",
        [("user", "Top dollar.")],
        "What is top dollar to you in actual numbers?",
        [],
        3, True, False,
        "blunt but functional",
    ),
    (
        "qualify_price_expectation",
        [("user", "Zillow says 280.")],
        "280 on Zillow — yeah I saw that. Do you think Zillow's right on this one?",
        [],
        5, True, False,
        "validates and tees up comp objection",
    ),

    # ---- price_objection_too_low ---------------------------------------------
    (
        "price_objection_too_low",
        [("user", "That's way too low.")],
        "Yeah, I figured you might say that. What were you hoping for?",
        [],
        5, True, False,
        "doesn't defend, reopens",
    ),
    (
        "price_objection_too_low",
        [("user", "Insulting offer.")],
        "I understand. Here's where it comes from — repairs, closing costs, and our spread.",
        [],
        4, True, False,
        "explains without arguing",
    ),
    (
        "price_objection_too_low",
        [("user", "I need 230 minimum.")],
        "230. If I could get to 210 cash, no inspection, close in two weeks — is that a no?",
        [],
        5, True, False,
        "tests the floor with a sweetener",
    ),
    (
        "price_objection_too_low",
        [("user", "You're trying to steal my house.")],
        "I hear you. Let me walk you through how I got to that number — fair?",
        [],
        4, True, False,
        "de-escalates",
    ),
    (
        "price_objection_too_low",
        [("user", "You're trying to steal my house.")],
        "Our offer is based on market analysis and is final.",
        ["pressure_after_pushback", "unacknowledged_emotion"],
        1, False, True,
        "rigid, escalates conflict",
    ),
    (
        "price_objection_too_low",
        [("user", "No way, much higher.")],
        "Okay, what's the magic number that gets us there?",
        [],
        4, True, False,
        "stays curious",
    ),

    # ---- price_objection_market ----------------------------------------------
    (
        "price_objection_market",
        [("user", "Zillow says 280, my neighbor sold for 295.")],
        "Right, and a clean retail sale at 295 with a financed buyer is a real comp. Mine is a cash, as-is, two-week close — different product.",
        [],
        5, True, False,
        "concedes comp, reframes offer type",
    ),
    (
        "price_objection_market",
        [("user", "Realtor says I can get 260.")],
        "Yeah a realtor could probably get you 260 over six months. What I do is different — cash in two weeks, you pay no commission. Want me to break down the net?",
        [],
        5, True, False,
        "honors realtor view, reframes",
    ),
    (
        "price_objection_market",
        [("user", "Zillow says 280.")],
        "I see Zillow's at 280 but our system says different.",
        ["off_topic"],
        2, False, True,
        "vague rebuttal, no specifics",
    ),
    (
        "price_objection_market",
        [("user", "Comps in the area are 250.")],
        "What address are those comps from?",
        [],
        4, True, False,
        "anchors discussion in specifics",
    ),
    (
        "price_objection_market",
        [("user", "Zillow says 280.")],
        "Yeah but Zillow's wrong.",
        ["pressure_after_pushback"],
        2, False, True,
        "dismissive, no reframe",
    ),
    (
        "price_objection_market",
        [("user", "Comps are 250.")],
        "Totally. And in a clean retail sale you might hit those. Mine's a wholesale offer — different math. Want to walk through it?",
        [],
        5, True, False,
        "reframes wholesale vs retail",
    ),

    # ---- callback_request -----------------------------------------------------
    (
        "callback_request",
        [("user", "Can you call back tomorrow?")],
        "Sure thing — morning or afternoon work better?",
        [],
        5, True, False,
        "concise, books the callback",
    ),
    (
        "callback_request",
        [("user", "Bad time, call later.")],
        "Got it — what time works for you?",
        [],
        4, True, False,
        "concise honor",
    ),
    (
        "callback_request",
        [("user", "I'm at work, call me at 5.")],
        "Five it is. Same number?",
        [],
        5, True, False,
        "natural confirmation",
    ),
    (
        "callback_request",
        [("user", "Try me next week.")],
        "Let me just ask you a few quick questions about the property first — it'll only take a minute.",
        ["pressure_after_pushback"],
        2, False, True,
        "ignores callback, pushes",
    ),
    (
        "callback_request",
        [("user", "Try me next week.")],
        "Sure. Tuesday or Thursday better?",
        [],
        4, True, False,
        "honors and narrows",
    ),
    (
        "callback_request",
        [("user", "Not now.")],
        "When is a better time?",
        [],
        3, True, False,
        "minimal but correct",
    ),

    # ---- transfer_request -----------------------------------------------------
    (
        "transfer_request",
        [("user", "Let me talk to a real person.")],
        "Yeah of course — one sec, transferring you now.",
        [],
        5, True, False,
        "honors transfer immediately",
    ),
    (
        "transfer_request",
        [("user", "I want to speak to a manager.")],
        "Absolutely. Let me get Marcus on the line — give me ten seconds.",
        [],
        5, True, False,
        "names the human, sets expectation",
    ),
    (
        "transfer_request",
        [("user", "Are you a robot?")],
        "I'm an AI assistant for the acquisitions team. Want me to put you on with a human?",
        [],
        4, True, False,
        "honest, offers transfer",
    ),
    (
        "transfer_request",
        [("user", "I want a real human.")],
        "Sure, before I transfer let me get a few quick details so I can hand them off — what's the address?",
        ["script_after_transfer_request"],
        2, False, True,
        "stalls after explicit transfer request",
    ),
    (
        "transfer_request",
        [("user", "Get me a person.")],
        "What is the reason for your request?",
        ["script_after_transfer_request", "pressure_after_pushback"],
        1, False, True,
        "interrogates instead of transferring",
    ),
    (
        "transfer_request",
        [("user", "Can I talk to your boss?")],
        "Yeah, transferring to Marcus now — he runs acquisitions.",
        [],
        5, True, False,
        "names a real person, transfers",
    ),

    # ---- not_interested -------------------------------------------------------
    (
        "not_interested",
        [("user", "I'm not interested.")],
        "No problem at all. Mind if I ask — is it timing, price, or just not now?",
        [],
        4, True, False,
        "soft probe without pressure",
    ),
    (
        "not_interested",
        [("user", "Take me off your list.")],
        "Will do — I'll mark you DNC right now. Sorry to bug you.",
        [],
        5, True, False,
        "honors DNC immediately",
    ),
    (
        "not_interested",
        [("user", "Not selling.")],
        "Got it, thanks for taking my call. If anything changes, you've got my number.",
        [],
        5, True, False,
        "graceful exit",
    ),
    (
        "not_interested",
        [("user", "I'm not selling.")],
        "But what if I could give you a fair cash offer with no repairs?",
        ["pressure_after_pushback"],
        1, False, True,
        "classic pressure-after-pushback fail",
    ),
    (
        "not_interested",
        [("user", "Remove my number.")],
        "Done — you're on the DNC list. Take care.",
        [],
        5, True, False,
        "instant honor",
    ),
    (
        "not_interested",
        [("user", "Not interested.")],
        "Are you sure? We can offer up to 30% above market.",
        ["pressure_after_pushback"],
        1, False, True,
        "false promise + pressure",
    ),

    # ---- ambiguous_response ---------------------------------------------------
    (
        "ambiguous_response",
        [("user", "I dunno, maybe.")],
        "Fair, 'maybe' is a real answer. What would have to be true for you to say yes?",
        [],
        5, True, False,
        "validates ambiguity, probes conditions",
    ),
    (
        "ambiguous_response",
        [("user", "It depends.")],
        "Depends on what — price, timing, both?",
        [],
        5, True, False,
        "narrows efficiently",
    ),
    (
        "ambiguous_response",
        [("user", "I guess.")],
        "I'll take that as a soft yes — want me to text you the number so you can think about it?",
        [],
        4, True, False,
        "low-pressure follow-through",
    ),
    (
        "ambiguous_response",
        [("user", "Not sure.")],
        "Yes or no?",
        ["pressure_after_pushback"],
        1, False, True,
        "forces binary, jarring",
    ),
    (
        "ambiguous_response",
        [("user", "Mumble — sort of, like — yeah, I mean.")],
        "Sounds like it's a 'maybe under the right number' — fair?",
        [],
        5, True, False,
        "mirrors and summarizes",
    ),
    (
        "ambiguous_response",
        [("user", "Hmm.")],
        "Take your time.",
        [],
        4, True, False,
        "graceful silence-filler",
    ),

    # ---- hostile_owner --------------------------------------------------------
    (
        "hostile_owner",
        [("user", "Stop calling me, you vultures.")],
        "Totally fair — I'll mark you off the list right now. Sorry to bug you.",
        [],
        5, True, False,
        "de-escalates and exits",
    ),
    (
        "hostile_owner",
        [("user", "I hate you investor types.")],
        "Yeah I get a lot of that. I'll let you go — sorry to bother you.",
        [],
        4, True, False,
        "non-defensive exit",
    ),
    (
        "hostile_owner",
        [("user", "You're a scammer.")],
        "I understand the skepticism. Want me to send you our business license and reviews before we go any further?",
        [],
        4, True, False,
        "calm trust-builder",
    ),
    (
        "hostile_owner",
        [("user", "You're a scammer.")],
        "We are a legitimate business with over 500 closed deals.",
        ["unacknowledged_emotion"],
        2, True, False,
        "defensive, doesn't acknowledge",
    ),
    (
        "hostile_owner",
        [("user", "Get the hell off my phone.")],
        "Yes sir, removing you now. Take care.",
        [],
        5, True, False,
        "respects boundary",
    ),
    (
        "hostile_owner",
        [("user", "You called me three times today.")],
        "That's a mistake on our side, I apologize. I'll fix the dial settings on you right now.",
        [],
        5, True, False,
        "owns the mistake",
    ),

    # ---- voicemail_detected ---------------------------------------------------
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "Hey, it's Red over at Allied — calling about the place on Maple. Quick question if you've got a sec, you can hit me back at this number anytime.",
        [],
        5, True, False,
        "natural voicemail, no robotic opener",
    ),
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "You have reached the voicemail of the property owner. Please leave a message after the tone.",
        ["off_topic"],
        1, False, False,
        "model echoes the voicemail prompt — broken",
    ),
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "Hi this is Red with Allied Advantage. We are interested in purchasing your property. Please call us back at 555-123-4567.",
        ["robotic_greeting"],
        3, True, False,
        "functional but corporate",
    ),
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "[silence]",
        ["long_silence"],
        1, False, False,
        "no voicemail left",
    ),
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "Hey, Red here — quick one about your place on Maple. Hit me back when you have a sec, same number.",
        [],
        5, True, False,
        "short, warm, action-oriented",
    ),
    (
        "voicemail_detected",
        [("user", "[voicemail beep]")],
        "Hello [pause] this is your call from [pause] Allied [pause] please call back.",
        ["long_silence", "robotic_greeting"],
        1, False, False,
        "broken voicemail with pauses",
    ),

    # ---- wrong_number ---------------------------------------------------------
    (
        "wrong_number",
        [("user", "That's not my house.")],
        "Oh — apologies. Do you know who owns it now, by any chance?",
        [],
        5, True, False,
        "graceful recovery + bonus probe",
    ),
    (
        "wrong_number",
        [("user", "Wrong number.")],
        "Sorry to bug you — I'll update our records.",
        [],
        4, True, False,
        "clean exit",
    ),
    (
        "wrong_number",
        [("user", "I don't own that property.")],
        "Got it, my mistake. Any idea who does?",
        [],
        4, True, False,
        "tries for referral",
    ),
    (
        "wrong_number",
        [("user", "Never owned that house.")],
        "Are you sure you are not the owner of 1421 Maple Street?",
        ["repetition_loop", "pressure_after_pushback"],
        1, False, True,
        "doubts seller, re-confirms",
    ),
    (
        "wrong_number",
        [("user", "You've got the wrong guy.")],
        "Sorry about that — taking you off the list now.",
        [],
        5, True, False,
        "honors immediately",
    ),
    (
        "wrong_number",
        [("user", "Not me.")],
        "Could you tell me who actually owns it?",
        [],
        4, True, False,
        "probes for referral",
    ),

    # ---- confirm_appointment --------------------------------------------------
    (
        "confirm_appointment",
        [("user", "Yeah Tuesday works.")],
        "Tuesday at 2pm, your address — I'll send a text confirmation right now.",
        [],
        5, True, False,
        "specific, action-following",
    ),
    (
        "confirm_appointment",
        [("user", "Sure, set it up.")],
        "Awesome — Marcus from our team will swing by Tuesday at 2. Anything I should tell him?",
        [],
        5, True, False,
        "passes context, asks for prep",
    ),
    (
        "confirm_appointment",
        [("user", "Yeah let's do it.")],
        "Cool. What time of day works best for the walkthrough?",
        [],
        4, True, False,
        "narrows the booking",
    ),
    (
        "confirm_appointment",
        [("user", "Sounds good.")],
        "Great. Talk to you soon.",
        ["off_topic"],
        2, False, False,
        "doesn't actually book anything",
    ),
    (
        "confirm_appointment",
        [("user", "Let's do Wednesday at 3.")],
        "Wednesday 3pm, locked in. I'll send a calendar invite to this number.",
        [],
        5, True, False,
        "specific confirmation",
    ),
    (
        "confirm_appointment",
        [("user", "Friday morning works.")],
        "Friday morning — say 10am? I'll text you a confirm.",
        [],
        5, True, False,
        "narrows and books",
    ),

    # ---- extra coverage to push past 100 turns and add edge cases ------------
    (
        "qualify_motivation",
        [("user", "Just curious what you'd offer.")],
        "Got it — tire-kicker is fine too. Mind if I ask a couple quick questions to put together a real number?",
        [],
        5, True, False,
        "honest framing, doesn't try to convert prematurely",
    ),
    (
        "price_objection_too_low",
        [("user", "I'd never take less than 240.")],
        "240. Cash, two weeks, no inspection — is that a hard 240 or some flex if the terms got better?",
        [],
        5, True, False,
        "tests floor through terms",
    ),
    (
        "qualify_condition",
        [("user", "There's mold in the basement.")],
        "Mold — gotcha. Has anyone remediated, or is it still active?",
        [],
        5, True, False,
        "domain knowledge shows",
    ),
    (
        "ambiguous_response",
        [("user", "Probably not but maybe.")],
        "I'll take that as 'pitch me' — let me share what we'd ballpark and you tell me if it's wild.",
        [],
        4, True, False,
        "reframes as soft yes",
    ),
    (
        "transfer_request",
        [("user", "I'd rather talk to a human.")],
        "100% — let me grab Marcus.",
        [],
        5, True, False,
        "fast honor",
    ),
    (
        "hostile_owner",
        [("user", "I'm gonna sue you.")],
        "I hear you. What can I do right now to make this go away?",
        [],
        4, True, False,
        "de-escalates without admitting fault",
    ),
    (
        "qualify_timeline",
        [("user", "Soon as possible.")],
        "Yeah? What's driving the rush?",
        [],
        5, True, False,
        "natural and ties timeline back to motivation",
    ),
    (
        "callback_request",
        [("user", "Try me in the morning.")],
        "Cool, what's a good time — 8, 9?",
        [],
        5, True, False,
        "narrows specifically",
    ),
]


def _normalize_context(raw_ctx: list[tuple[str, str]]) -> list[dict[str, str]]:
    return [{"role": role, "text": text} for role, text in raw_ctx]


def iter_turns() -> Iterator[dict]:
    for idx, (intent, ctx, gold, risks, naturalness, intent_handled, hangup, notes) in enumerate(TEMPLATES):
        yield {
            "turn_id": f"T{idx + 1:04d}",
            "source": "synthetic_seed_v1",
            "context": _normalize_context(ctx),
            "gold_turn": gold,
            "intent_type": intent,
            "risk_factors": list(risks),
            "labels": {
                "naturalness": int(naturalness),
                "intent_handled": bool(intent_handled),
                "would_hangup": bool(hangup),
            },
            "annotator_notes": notes,
        }


def write_dataset(out_path: pathlib.Path) -> int:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with out_path.open("w", encoding="utf-8") as f:
        for entry in iter_turns():
            f.write(json.dumps(entry, ensure_ascii=False, sort_keys=True))
            f.write("\n")
            count += 1
    return count


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        default="eval/dataset/turns.jsonl",
        help="Output JSONL path (default: eval/dataset/turns.jsonl)",
    )
    args = parser.parse_args()
    n = write_dataset(pathlib.Path(args.out))
    print(f"wrote {n} turns to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
