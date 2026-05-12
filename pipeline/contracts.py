"""Typed input/output contracts shared across optimization agents.

An ``AccountExport`` is the raw input — a snapshot of a Google Ads account
serialized to JSON. Each agent consumes the same ``AccountExport`` and emits a
list of ``Recommendation`` objects. The pipeline orchestrator merges, sorts,
and renders them into the final markdown report.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class Keyword:
    text: str
    match_type: str
    campaign: str
    ad_group: str
    impressions: int
    clicks: int
    cost: float
    conversions: float


@dataclass(frozen=True)
class Ad:
    campaign: str
    ad_group: str
    headline: str
    description: str
    impressions: int
    clicks: int
    conversions: float


@dataclass(frozen=True)
class Campaign:
    name: str
    budget_daily: float
    cost: float
    conversions: float
    conversion_value: float


@dataclass(frozen=True)
class GeoRow:
    campaign: str
    region: str
    cost: float
    conversions: float


@dataclass(frozen=True)
class AccountExport:
    account_id: str
    account_name: str
    date_range: str
    campaigns: List[Campaign]
    keywords: List[Keyword]
    ads: List[Ad]
    geo: List[GeoRow]

    @classmethod
    def from_dict(cls, data: dict) -> "AccountExport":
        return cls(
            account_id=data["account_id"],
            account_name=data["account_name"],
            date_range=data["date_range"],
            campaigns=[Campaign(**c) for c in data["campaigns"]],
            keywords=[Keyword(**k) for k in data["keywords"]],
            ads=[Ad(**a) for a in data["ads"]],
            geo=[GeoRow(**g) for g in data["geo"]],
        )


@dataclass(frozen=True, order=True)
class Recommendation:
    """One actionable optimization recommendation.

    ``priority`` is 1 (highest) through 5 (lowest); the orchestrator sorts
    ascending so priority 1 appears first.
    """
    priority: int
    estimated_monthly_savings: float
    agent: str = field(compare=False)
    category: str = field(compare=False)
    title: str = field(compare=False)
    rationale: str = field(compare=False)
    action: str = field(compare=False)
    evidence: Optional[str] = field(default=None, compare=False)
