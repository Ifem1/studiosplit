"""Real GenLayer direct-mode tests.

They are skipped only when the official `genlayer-test` runtime is unavailable.
With the dependency installed, pytest's direct_vm/direct_deploy fixtures execute them.
"""
import json
import pytest

pytest.importorskip("genlayer_test", reason="official GenLayer direct-test runtime is not installed")

RUBRIC = json.dumps({"dimensions": [
    {"code": "WRITING", "weight": 30},
    {"code": "ARRANGEMENT", "weight": 20},
    {"code": "PRODUCTION", "weight": 25},
    {"code": "VISUAL_EDIT", "weight": 15},
    {"code": "DIRECTION", "weight": 10},
]})
DIGEST = "sha256:" + "a" * 64


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
    assert contract.list_collaborators(1)[0]["wallet"].lower() == direct_alice.as_hex.lower()


def test_unregistered_wallet_cannot_checkpoint(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/studiosplit.py")
    direct_vm.sender = direct_alice
    contract.create_project("Afterglow", "https://example.com/charter-v1.txt", DIGEST, RUBRIC)
    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("registered collaborator only"):
        contract.submit_checkpoint(
            1,
            "https://example.com/evidence-v1.txt",
            DIGEST,
            "WRITING",
            "A bounded contribution description that is long enough.",
        )
