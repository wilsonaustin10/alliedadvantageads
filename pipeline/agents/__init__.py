"""Optimization agents for the Allied Advantage Ads pipeline.

Each agent is a callable that takes an ``AccountExport`` and returns a list of
``Recommendation``. Agents are pure functions — no I/O, no network calls,
deterministic for a given input.
"""
from pipeline.agents.keyword_agent import run as keyword_agent
from pipeline.agents.ad_copy_agent import run as ad_copy_agent
from pipeline.agents.budget_agent import run as budget_agent
from pipeline.agents.geo_agent import run as geo_agent

AGENTS = [keyword_agent, ad_copy_agent, budget_agent, geo_agent]

__all__ = ["AGENTS", "keyword_agent", "ad_copy_agent", "budget_agent", "geo_agent"]
