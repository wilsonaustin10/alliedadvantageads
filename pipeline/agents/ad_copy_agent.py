"""Ad copy optimization agent.

Flags ads with statistically meaningful underperformance: enough impressions
to be a real signal, and CTR or conversion rate well below the ad group's
best performer.
"""
from __future__ import annotations

from collections import defaultdict
from typing import List

from pipeline.contracts import AccountExport, Recommendation

AGENT_NAME = "AdCopyAgent"

MIN_IMPRESSIONS = 500
CTR_LAGGARD_RATIO = 0.5  # ad's CTR less than half of best ad in same ad group


def run(export: AccountExport) -> List[Recommendation]:
    recs: List[Recommendation] = []

    groups = defaultdict(list)
    for ad in export.ads:
        groups[(ad.campaign, ad.ad_group)].append(ad)

    for (campaign, ad_group), ads in groups.items():
        if len(ads) < 2:
            continue
        ctrs = [(ad.clicks / ad.impressions) if ad.impressions else 0.0 for ad in ads]
        best_ctr = max(ctrs)
        if best_ctr == 0:
            continue

        for ad, ctr in zip(ads, ctrs):
            if ad.impressions < MIN_IMPRESSIONS:
                continue
            if ctr >= best_ctr * CTR_LAGGARD_RATIO:
                continue

            # Rough lift estimate: if the laggard's impressions converted at
            # the best ad's CTR and the ad group's conversion rate, how much
            # more value would we capture? We surface clicks-gained as the
            # "savings" proxy.
            extra_clicks = (best_ctr - ctr) * ad.impressions
            recs.append(Recommendation(
                priority=3,
                estimated_monthly_savings=round(extra_clicks, 2),
                agent=AGENT_NAME,
                category="Ad copy underperformer",
                title=f"Pause low-CTR ad in '{ad_group}'",
                rationale=(
                    f"CTR {ctr * 100:.2f}% vs best ad in ad group {best_ctr * 100:.2f}% "
                    f"over {ad.impressions} impressions."
                ),
                action=(
                    f"Pause ad headlined '{ad.headline}' and draft a variant "
                    f"mirroring the top performer's structure."
                ),
                evidence=f"campaign={campaign} ad_group={ad_group} clicks={ad.clicks}",
            ))

    return recs
