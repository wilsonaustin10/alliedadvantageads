"""Pipeline orchestrator.

Usage::

    python -m pipeline.run <account_id> [--export PATH] [--out DIR] [--date YYYY-MM-DD]

Resolves an account export, runs the four optimization agents in sequence,
merges and sorts their recommendations, and writes a markdown report to
``reports/<account>/<date>.md``.
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import date as date_cls
from pathlib import Path
from typing import Iterable, List, Optional

from pipeline.agents import AGENTS
from pipeline.contracts import AccountExport, Recommendation

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_FIXTURES = REPO_ROOT / "fixtures"
DEFAULT_REPORTS_DIR = REPO_ROOT / "reports"


@dataclass
class PipelineResult:
    account_id: str
    report_path: Path
    recommendations: List[Recommendation]
    report_text: str


def load_export(account_id: str, explicit_path: Optional[Path] = None) -> AccountExport:
    if explicit_path is not None:
        path = explicit_path
    else:
        path = DEFAULT_FIXTURES / account_id / "export.json"
    if not path.exists():
        raise FileNotFoundError(
            f"No account export found for '{account_id}' at {path}. "
            "Pass --export to point at a specific file."
        )
    with path.open() as f:
        return AccountExport.from_dict(json.load(f))


def _sort_key(rec: Recommendation):
    return (rec.priority, -rec.estimated_monthly_savings, rec.agent, rec.title)


def run_agents(export: AccountExport) -> List[Recommendation]:
    all_recs: List[Recommendation] = []
    for agent in AGENTS:
        all_recs.extend(agent(export))
    all_recs.sort(key=_sort_key)
    return all_recs


def render_report(
    export: AccountExport,
    recs: Iterable[Recommendation],
    run_date: date_cls,
) -> str:
    recs = list(recs)
    total_savings = sum(r.estimated_monthly_savings for r in recs)

    lines: List[str] = []
    lines.append(f"# Optimization Report — {export.account_name}")
    lines.append("")
    lines.append(f"- **Account ID:** {export.account_id}")
    lines.append(f"- **Data window:** {export.date_range}")
    lines.append(f"- **Generated:** {run_date.isoformat()}")
    lines.append(f"- **Recommendations:** {len(recs)}")
    lines.append(f"- **Estimated monthly impact:** ${total_savings:,.2f}")
    lines.append("")
    lines.append("## Prioritized Recommendations")
    lines.append("")

    if not recs:
        lines.append("_No actionable recommendations from this data window._")
    else:
        for idx, rec in enumerate(recs, start=1):
            lines.append(f"### {idx}. [P{rec.priority}] {rec.title}")
            lines.append("")
            lines.append(f"- **Agent:** {rec.agent}")
            lines.append(f"- **Category:** {rec.category}")
            lines.append(f"- **Estimated monthly impact:** ${rec.estimated_monthly_savings:,.2f}")
            lines.append(f"- **Rationale:** {rec.rationale}")
            lines.append(f"- **Action:** {rec.action}")
            if rec.evidence:
                lines.append(f"- **Evidence:** {rec.evidence}")
            lines.append("")

    lines.append("## Agent Coverage")
    lines.append("")
    counts = {}
    for r in recs:
        counts[r.agent] = counts.get(r.agent, 0) + 1
    for agent in ("KeywordAgent", "AdCopyAgent", "BudgetAgent", "GeoAgent"):
        lines.append(f"- {agent}: {counts.get(agent, 0)} recommendation(s)")
    lines.append("")

    return "\n".join(lines)


def run_pipeline(
    account_id: str,
    export_path: Optional[Path] = None,
    output_dir: Optional[Path] = None,
    run_date: Optional[date_cls] = None,
) -> PipelineResult:
    export = load_export(account_id, export_path)
    recs = run_agents(export)
    when = run_date or date_cls.today()
    report = render_report(export, recs, when)

    out_root = output_dir or DEFAULT_REPORTS_DIR
    out_dir = out_root / account_id
    out_dir.mkdir(parents=True, exist_ok=True)
    report_path = out_dir / f"{when.isoformat()}.md"
    report_path.write_text(report)

    return PipelineResult(
        account_id=account_id,
        report_path=report_path,
        recommendations=recs,
        report_text=report,
    )


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Run the optimization pipeline for an account.")
    parser.add_argument("account_id", help="Account identifier; also the fixtures/<id>/ folder name.")
    parser.add_argument("--export", type=Path, default=None, help="Explicit path to export.json.")
    parser.add_argument("--out", type=Path, default=None, help="Reports output root (default: reports/).")
    parser.add_argument("--date", default=None, help="Override report date (YYYY-MM-DD).")
    args = parser.parse_args(argv)

    when = date_cls.fromisoformat(args.date) if args.date else None
    result = run_pipeline(args.account_id, args.export, args.out, when)
    print(f"Wrote {result.report_path} ({len(result.recommendations)} recommendations)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
