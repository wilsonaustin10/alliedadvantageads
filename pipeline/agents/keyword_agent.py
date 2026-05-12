"""Keyword optimization agent.

Flags wasteful keywords: high spend with zero conversions, and high CPA
keywords whose cost-per-acquisition exceeds the account's average by a wide
margin.
"""
from __future__ import annotations

from typing import List

from pipeline.contracts import AccountExport, Recommendation

AGENT_NAME = "KeywordAgent"

# Threshold: a keyword that spent more than this with zero conversions is
# considered wasteful and should be paused or negated.
ZERO_CONV_SPEND_THRESHOLD = 50.0

# A keyword whose CPA is more than this multiple of the account-wide CPA is
# flagged as a high-CPA outlier.
HIGH_CPA_MULTIPLIER = 2.5


def run(export: AccountExport) -> List[Recommendation]:
    recs: List[Recommendation] = []

    total_conversions = sum(k.conversions for k in export.keywords)
    total_cost = sum(k.cost for k in export.keywords)
    account_cpa = (total_cost / total_conversions) if total_conversions > 0 else 0.0

    for kw in export.keywords:
        if kw.conversions == 0 and kw.cost >= ZERO_CONV_SPEND_THRESHOLD:
            recs.append(Recommendation(
                priority=1,
                estimated_monthly_savings=round(kw.cost, 2),
                agent=AGENT_NAME,
                category="Wasted spend",
                title=f"Pause zero-conversion keyword: '{kw.text}'",
                rationale=(
                    f"Spent ${kw.cost:.2f} across {kw.clicks} clicks in "
                    f"{export.date_range} with zero conversions."
                ),
                action=(
                    f"Pause keyword '{kw.text}' ({kw.match_type}) in ad group "
                    f"'{kw.ad_group}' and add as account-level negative."
                ),
                evidence=f"campaign={kw.campaign} clicks={kw.clicks} cost=${kw.cost:.2f}",
            ))
            continue

        if kw.conversions > 0 and account_cpa > 0:
            kw_cpa = kw.cost / kw.conversions
            if kw_cpa >= account_cpa * HIGH_CPA_MULTIPLIER:
                excess = kw.cost - (account_cpa * kw.conversions)
                recs.append(Recommendation(
                    priority=2,
                    estimated_monthly_savings=round(max(excess, 0.0), 2),
                    agent=AGENT_NAME,
                    category="High CPA",
                    title=f"Lower bid or pause high-CPA keyword: '{kw.text}'",
                    rationale=(
                        f"CPA is ${kw_cpa:.2f} vs account average ${account_cpa:.2f} "
                        f"({kw_cpa / account_cpa:.1f}x)."
                    ),
                    action=(
                        f"Reduce max CPC by 30% on '{kw.text}' or move to a "
                        f"separate ad group with tighter match type."
                    ),
                    evidence=f"campaign={kw.campaign} cost=${kw.cost:.2f} conv={kw.conversions}",
                ))

    return recs
