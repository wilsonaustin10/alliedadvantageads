"""Golden-file test for the optimization pipeline.

We compare the generated report against ``fixtures/sample_account/expected_report.md``
with a line-diff tolerance of less than 5%. Small wording or formatting drift is
allowed; large behavior changes will trip the test and force a deliberate
refresh of the golden file.
"""
from __future__ import annotations

import difflib
from datetime import date
from pathlib import Path

import pytest

from pipeline.run import run_pipeline

REPO_ROOT = Path(__file__).resolve().parent.parent
FIXTURE_DIR = REPO_ROOT / "fixtures" / "sample_account"
EXPORT_PATH = FIXTURE_DIR / "export.json"
GOLDEN_PATH = FIXTURE_DIR / "expected_report.md"

LINE_DIFF_TOLERANCE = 0.05


def _line_diff_ratio(actual: str, expected: str) -> float:
    actual_lines = actual.splitlines()
    expected_lines = expected.splitlines()
    matcher = difflib.SequenceMatcher(a=expected_lines, b=actual_lines, autojunk=False)
    matched = sum(block.size for block in matcher.get_matching_blocks())
    total = max(len(actual_lines), len(expected_lines))
    if total == 0:
        return 0.0
    changed = total - matched
    return changed / total


def test_pipeline_matches_golden_report(tmp_path: Path) -> None:
    result = run_pipeline(
        account_id="sample_account",
        export_path=EXPORT_PATH,
        output_dir=tmp_path,
        run_date=date(2026, 5, 1),
    )

    expected = GOLDEN_PATH.read_text()
    actual = result.report_text

    ratio = _line_diff_ratio(actual, expected)
    if ratio >= LINE_DIFF_TOLERANCE:
        diff = "\n".join(difflib.unified_diff(
            expected.splitlines(),
            actual.splitlines(),
            fromfile="expected_report.md",
            tofile="actual",
            lineterm="",
        ))
        pytest.fail(
            f"Report diverged from golden file by {ratio:.1%} "
            f"(tolerance {LINE_DIFF_TOLERANCE:.0%}).\n\n{diff}"
        )


def test_pipeline_writes_dated_file(tmp_path: Path) -> None:
    result = run_pipeline(
        account_id="sample_account",
        export_path=EXPORT_PATH,
        output_dir=tmp_path,
        run_date=date(2026, 5, 1),
    )
    expected_path = tmp_path / "sample_account" / "2026-05-01.md"
    assert result.report_path == expected_path
    assert expected_path.exists()


def test_all_four_agents_contribute() -> None:
    result = run_pipeline(
        account_id="sample_account",
        export_path=EXPORT_PATH,
        output_dir=Path("/tmp"),
        run_date=date(2026, 5, 1),
    )
    agents_seen = {rec.agent for rec in result.recommendations}
    assert agents_seen == {"KeywordAgent", "AdCopyAgent", "BudgetAgent", "GeoAgent"}


def test_recommendations_sorted_by_priority() -> None:
    result = run_pipeline(
        account_id="sample_account",
        export_path=EXPORT_PATH,
        output_dir=Path("/tmp"),
        run_date=date(2026, 5, 1),
    )
    priorities = [r.priority for r in result.recommendations]
    assert priorities == sorted(priorities)
