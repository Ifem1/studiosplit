"""Real GenLayer direct-mode tests.

They are skipped only when the official `genlayer-test` runtime is unavailable.
With the dependency installed, pytest's direct_vm/direct_deploy fixtures execute them.
"""
import json
import hashlib
import ast
from pathlib import Path
import pytest

_source_tree = ast.parse((Path(__file__).parents[2] / "contracts" / "studiosplit.py").read_text())
_comparison_nodes = [node for node in _source_tree.body if isinstance(node, ast.FunctionDef) and node.name in {
    "_normalize_decision_candidate", "_decision_candidates_equivalent"
}]
_comparison_namespace = {}
exec(compile(ast.Module(body=_comparison_nodes, type_ignores=[]), "studiosplit.py", "exec"), _comparison_namespace)
_decision_candidates_equivalent = _comparison_namespace["_decision_candidates_equivalent"]

pytest.importorskip("gltest", reason="official GenLayer direct-test runtime is not installed")

RUBRIC = json.dumps({"dimensions": [
    {"code": "WRITING", "weight": 30},
    {"code": "ARRANGEMENT", "weight": 20},
    {"code": "PRODUCTION", "weight": 25},
    {"code": "VISUAL_EDIT", "weight": 15},
    {"code": "DIRECTION", "weight": 10},
]})
DIGEST = "sha256:" + "a" * 64
CHARTER_URL = "https://example.com/charter-v1.txt"
EVIDENCE_URL = "https://example.com/evidence-v1.txt"
CHARTER_TEXT = "A signed project charter establishing the frozen creative scope."
EVIDENCE_TEXT = "Public evidence records the collaborator's concrete writing decisions."


EXPECTED_PAIRS = ["0xabc|ARRANGEMENT", "0xabc|DIRECTION"]


def candidate(rows, reason=""):
    return {"outcome": "FINALIZE", "bands": rows, "reason": reason}


def test_comparator_normalizes_order_and_ignores_rationale_and_relation():
    left = candidate([
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "DEPENDENT"},
    ], "left")
    right = candidate([
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "DUPLICATIVE"},
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 3, "relation": "NORMAL"},
    ], "right")
    assert _decision_candidates_equivalent(left, right, EXPECTED_PAIRS)


def test_comparator_rejects_large_or_zero_positive_band_drift():
    base = candidate([
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "NORMAL"},
    ])
    assert not _decision_candidates_equivalent(base, candidate([
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 4, "relation": "NORMAL"},
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "NORMAL"},
    ]), EXPECTED_PAIRS)
    assert not _decision_candidates_equivalent(base, candidate([
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 1, "relation": "NORMAL"},
    ]), EXPECTED_PAIRS)


def test_comparator_rejects_invented_or_missing_pairs():
    base = candidate([
        {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
        {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "NORMAL"},
    ])
    with pytest.raises(AssertionError):
        _decision_candidates_equivalent(base, candidate([
            {"wallet": "0xdef", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
            {"wallet": "0xabc", "dimension": "DIRECTION", "band": 0, "relation": "NORMAL"},
        ]), EXPECTED_PAIRS)
    with pytest.raises(AssertionError):
        _decision_candidates_equivalent(base, candidate([
            {"wallet": "0xabc", "dimension": "ARRANGEMENT", "band": 2, "relation": "NORMAL"},
        ]), EXPECTED_PAIRS)


def digest(value: str) -> str:
    return "sha256:" + hashlib.sha256(value.encode("utf-8")).hexdigest()


def address_hex(value: bytes) -> str:
    return "0x" + bytes(value).hex()


def setup_project(contract, direct_vm, direct_deploy, alice, bob):
    direct_vm.sender = alice
    project_id = contract.create_project("Steward runtime", CHARTER_URL, digest(CHARTER_TEXT), RUBRIC)
    contract.add_collaborator(project_id, address_hex(bob), "Editor")
    return project_id


def prepare_finalization(contract, direct_vm, project_id, alice, bob):
    direct_vm.sender = alice
    contract.submit_checkpoint(project_id, EVIDENCE_URL, digest(EVIDENCE_TEXT), "WRITING", "A bounded contribution description that is long enough.")
    direct_vm.sender = bob
    contract.accept_collaboration(project_id)
    direct_vm.sender = alice
    return contract.request_finalization(project_id, EVIDENCE_URL, digest(EVIDENCE_TEXT))


def configure_successful_evidence(direct_vm, alice, bob):
    direct_vm.mock_web("charter-v1\\.txt", {"status": 200, "body": CHARTER_TEXT})
    direct_vm.mock_web("evidence-v1\\.txt", {"status": 200, "body": EVIDENCE_TEXT})
    dimensions = ["WRITING", "ARRANGEMENT", "PRODUCTION", "VISUAL_EDIT", "DIRECTION"]
    bands = [{"wallet": address_hex(wallet), "dimension": dimension, "band": 0, "relation": "NORMAL"}
             for wallet in (alice, bob) for dimension in dimensions]
    bands[0]["band"] = 3
    response = json.dumps({"outcome": "FINALIZE", "bands": bands, "reason": "Verified."})
    direct_vm.mock_llm(".*", response)


def test_create_project_and_backendless_views(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/studiosplit.py")
    direct_vm.sender = direct_alice
    project_id = contract.create_project("Afterglow", "https://example.com/charter-v1.txt", DIGEST, RUBRIC)
    assert project_id == 1
    assert contract.get_project_count() == 1
    project = contract.get_project(1)
    assert project["status"] == "OPEN"
    assert project["collaborator_count"] == 1
    assert contract.list_projects(0, 20)[0]["project_id"] == 1
    assert contract.list_collaborators(1)[0]["wallet"].lower() == address_hex(direct_alice).lower()


def test_unregistered_wallet_cannot_checkpoint(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/studiosplit.py")
    direct_vm.sender = direct_alice
    contract.create_project("Afterglow", "https://example.com/charter-v1.txt", DIGEST, RUBRIC)
    direct_vm.sender = direct_bob
    with pytest.raises(AssertionError, match="registered collaborator only"):
        contract.submit_checkpoint(
            1,
            "https://example.com/evidence-v1.txt",
            DIGEST,
            "WRITING",
            "A bounded contribution description that is long enough.",
        )


def test_invalid_evidence_digest_is_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/studiosplit.py")
    direct_vm.sender = direct_alice
    contract.create_project("Digest guard", "https://example.com/charter-v1.txt", DIGEST, RUBRIC)
    with pytest.raises(AssertionError, match="artifact digest must be sha256"):
        contract.submit_checkpoint(
            1,
            "https://example.com/evidence-v1.txt",
            "sha256:" + "b" * 63,
            "WRITING",
            "A bounded contribution description that is long enough.",
        )


def test_duplicate_collaborator_is_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/studiosplit.py")
    direct_vm.sender = direct_alice
    contract.create_project("Collaborator guard", "https://example.com/charter-v1.txt", DIGEST, RUBRIC)
    with pytest.raises(AssertionError, match="collaborator already registered"):
        contract.add_collaborator(1, address_hex(direct_alice), "Duplicate")


def test_collaborator_acceptance_is_recorded_and_required(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/studiosplit.py")
    project_id = setup_project(contract, direct_vm, direct_deploy, direct_alice, direct_bob)
    assert contract.list_collaborators(project_id)[1]["accepted"] is False
    direct_vm.sender = direct_alice
    contract.submit_checkpoint(project_id, EVIDENCE_URL, digest(EVIDENCE_TEXT), "WRITING", "A bounded contribution description that is long enough.")
    with pytest.raises(AssertionError, match="all collaborators must accept before finalization"):
        contract.request_finalization(project_id, EVIDENCE_URL, digest(EVIDENCE_TEXT))
    direct_vm.sender = direct_bob
    contract.accept_collaboration(project_id)
    assert contract.list_collaborators(project_id)[1]["accepted"] is True


def test_evidence_failure_abstains_and_retry_creates_fresh_finalization(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/studiosplit.py")
    project_id = setup_project(contract, direct_vm, direct_deploy, direct_alice, direct_bob)
    finalization_id = prepare_finalization(contract, direct_vm, project_id, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    result = contract.adjudicate_finalization(finalization_id)
    assert result["status"] == "ABSTAINED"
    assert contract.get_finalization(finalization_id)["status"] == "ABSTAINED"
    retry_id = contract.retry_finalization(finalization_id, EVIDENCE_URL, digest(EVIDENCE_TEXT))
    assert retry_id != finalization_id
    assert contract.get_finalization(retry_id)["status"] == "FINALIZATION_REQUESTED"
    assert contract.get_project(project_id)["active_finalization_id"] == retry_id


def test_successful_adjudication_after_retry_finalizes_exactly_10000(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/studiosplit.py")
    project_id = setup_project(contract, direct_vm, direct_deploy, direct_alice, direct_bob)
    finalization_id = prepare_finalization(contract, direct_vm, project_id, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    assert contract.adjudicate_finalization(finalization_id)["status"] == "ABSTAINED"
    retry_id = contract.retry_finalization(finalization_id, EVIDENCE_URL, digest(EVIDENCE_TEXT))
    configure_successful_evidence(direct_vm, direct_alice, direct_bob)
    result = contract.adjudicate_finalization(retry_id)
    assert result["status"] == "FINALIZED"
    assert contract.get_project(project_id)["status"] == "FINALIZED"
    assert contract.get_finalization(retry_id)["status"] == "FINALIZED"
    assert contract.get_split(project_id)["total_bps"] == 10000
