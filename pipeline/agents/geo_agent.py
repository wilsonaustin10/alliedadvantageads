"""Geographic targeting agent.

Identifies regions that are draining budget without producing conversions and
recommends excluding them from campaign targeting.
"""
from __future__ import annotations

from typing import List

from pipeline.contracts import AccountExport, Recommendation

AGENT_NAME = "GeoAgent"

ZERO_CONV_GEO_SPEND_THRESHOLD = 75.0


def run(export: AccountExport) -> List[Recommendation]:
    recs: List[Recommendation] = []

    for row in export.geo:
        if row.conversions == 0 and row.cost >= ZERO_CONV_GEO_SPEND_THRESHOLD:
            recs.append(Recommendation(
                priority=2,
                estimated_monthly_savings=round(row.cost, 2),
                agent=AGENT_NAME,
                category="Geo exclusion",
                title=f"Exclude region '{row.region}' from '{row.campaign}'",
                rationale=(
                    f"${row.cost:.2f} spent in {row.region} with zero conversions "
                    f"during {export.date_range}."
                ),
                action=(
                    f"Add '{row.region}' to the location exclusion list for "
                    f"campaign '{row.campaign}'."
                ),
                evidence=f"campaign={row.campaign} region={row.region} cost=${row.cost:.2f}",
            ))

    return recs
