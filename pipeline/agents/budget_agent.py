"""Budget reallocation agent.

Compares campaign-level CPA and recommends shifting daily budget from the
worst CPA campaigns to the best, when the gap is wide enough to be material.
"""
from __future__ import annotations

from typing import List

from pipeline.contracts import AccountExport, Recommendation

AGENT_NAME = "BudgetAgent"

CPA_GAP_MULTIPLIER = 2.0
MIN_SHIFT = 10.0  # don't bother recommending budget changes smaller than $10/day


def run(export: AccountExport) -> List[Recommendation]:
    recs: List[Recommendation] = []

    scored = []
    for camp in export.campaigns:
        if camp.conversions <= 0:
            scored.append((camp, float("inf")))
        else:
            scored.append((camp, camp.cost / camp.conversions))

    if len(scored) < 2:
        return recs

    scored.sort(key=lambda x: x[1])
    best_camp, best_cpa = scored[0]
    worst_camp, worst_cpa = scored[-1]

    if best_cpa == float("inf"):
        return recs
    if worst_cpa < best_cpa * CPA_GAP_MULTIPLIER:
        return recs

    shift = round(min(worst_camp.budget_daily * 0.3, best_camp.budget_daily * 0.5), 2)
    if shift < MIN_SHIFT:
        return recs

    if worst_cpa == float("inf"):
        ratio_text = "no conversions"
    else:
        ratio_text = f"{worst_cpa / best_cpa:.1f}x"

    recs.append(Recommendation(
        priority=2,
        estimated_monthly_savings=round(shift * 30, 2),
        agent=AGENT_NAME,
        category="Budget reallocation",
        title=f"Shift ${shift:.0f}/day from '{worst_camp.name}' to '{best_camp.name}'",
        rationale=(
            f"'{best_camp.name}' CPA ${best_cpa:.2f}; "
            f"'{worst_camp.name}' CPA {ratio_text}. Reallocate to compound returns."
        ),
        action=(
            f"Reduce daily budget for '{worst_camp.name}' by ${shift:.0f} and "
            f"raise '{best_camp.name}' by the same amount. Re-evaluate in 14 days."
        ),
        evidence=(
            f"best=${best_camp.cost:.2f}/{best_camp.conversions:g}conv  "
            f"worst=${worst_camp.cost:.2f}/{worst_camp.conversions:g}conv"
        ),
    ))

    return recs
