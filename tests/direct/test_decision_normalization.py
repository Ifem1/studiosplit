import ast
from pathlib import Path

import pytest


SOURCE = Path(__file__).parents[2] / "contracts" / "studiosplit.py"
TREE = ast.parse(SOURCE.read_text())
NORMALIZER = next(
    node for node in TREE.body
    if isinstance(node, ast.FunctionDef) and node.name == "_normalize_decision_candidate"
)
NAMESPACE: dict = {}
exec(compile(ast.Module([NORMALIZER], type_ignores=[]), str(SOURCE), "exec"), NAMESPACE)
normalize = NAMESPACE["_normalize_decision_candidate"]

PAIRS = ["0xaaa|MUSIC", "0xaaa|WRITING"]


def candidate(*, reason="one explanation", band=2, relation="NORMAL", rows=None):
    return {
        "outcome": "FINALIZE",
        "bands": rows if rows is not None else [
            {"wallet": "0xaaa", "dimension": "WRITING", "band": band, "relation": relation},
            {"wallet": "0xaaa", "dimension": "MUSIC", "band": band, "relation": relation},
        ],
        "reason": reason,
    }


def test_equivalent_results_ignore_rationale_wording():
    left = normalize(candidate(reason="short reason"), PAIRS)
    right = normalize(candidate(reason="different detailed reason"), PAIRS)
    assert left == right


def test_reordered_band_rows_normalize_to_same_order():
    left = normalize(candidate(), PAIRS)
    right = normalize(candidate(rows=list(reversed(candidate()["bands"]))), PAIRS)
    assert left == right


def test_changed_band_fails_comparison():
    assert normalize(candidate(band=2), PAIRS) != normalize(candidate(band=3), PAIRS)


def test_changed_relation_fails_comparison():
    assert normalize(candidate(relation="NORMAL"), PAIRS) != normalize(candidate(relation="DEPENDENT"), PAIRS)


def test_missing_or_extra_pairs_fail():
    with pytest.raises(AssertionError):
        normalize(candidate(rows=[candidate()["bands"][0]]), PAIRS)
    with pytest.raises(AssertionError):
        normalize(candidate(rows=candidate()["bands"] + [{"wallet": "0xaaa", "dimension": "VIDEO", "band": 1, "relation": "NORMAL"}]), PAIRS)


def test_invented_identity_fails():
    rows = candidate()["bands"]
    rows[0] = {**rows[0], "wallet": "0xbbb"}
    with pytest.raises(AssertionError):
        normalize(candidate(rows=rows), PAIRS)


def test_empty_abstention_is_valid_and_has_no_provenance_fields():
    assert normalize({"outcome": "ABSTAIN", "bands": [], "reason": "insufficient"}, PAIRS) == {
        "outcome": "ABSTAIN",
        "bands": [],
    }
