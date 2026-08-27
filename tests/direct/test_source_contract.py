from pathlib import Path
import ast

SOURCE = Path(__file__).parents[2] / "contracts" / "studiosplit.py"
TEXT = SOURCE.read_text()
TREE = ast.parse(TEXT)


def method_names() -> set[str]:
    for node in TREE.body:
        if isinstance(node, ast.ClassDef) and node.name == "StudioSplit":
            return {n.name for n in node.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))}
    return set()


def test_required_backendless_contract_surface_exists():
    required = {
        "create_project", "add_collaborator", "accept_collaboration", "submit_checkpoint", "request_finalization",
        "retry_finalization",
        "adjudicate_finalization", "cancel_finalization", "get_project_count", "get_project",
        "list_projects", "list_collaborators", "get_checkpoint", "list_checkpoints",
        "get_finalization", "get_split", "preview_overlaps",
    }
    assert required <= method_names()


def test_core_safety_guards_are_present_in_deployable_source():
    assert '"registered collaborator only"' in TEXT
    assert 'assert total > 0, "cannot normalize zero scores"' in TEXT
    assert '== 10000, "split normalization failed"' in TEXT
    assert 'outcome in ("FINALIZE", "ABSTAIN")' in TEXT
    assert "project_version" in TEXT and "dimension_code" in TEXT
    assert "_verify_evidence_digest" in TEXT
    assert "Do not output percentages or basis points" in TEXT


def test_charter_provenance_and_consent_are_authoritative():
    assert 'gl.nondet.web.get(project.charter_url).body.decode("utf-8")' in TEXT
    assert 'self._verify_evidence_digest(charter_text, project.charter_digest, "charter evidence")' in TEXT
    assert 'accepted: bool' in TEXT
    assert 'assert collab.accepted, "all collaborators must accept before finalization"' in TEXT
    assert 'def accept_collaboration(self, project_id: int)' in TEXT
    assert 'wallet if isinstance(wallet, Address) else Address(wallet)' in TEXT


def test_abstention_has_a_retryable_adjudication_path():
    assert 'def retry_finalization(self, finalization_id: int, release_artifact_url: str, release_digest: str)' in TEXT
    assert 'assert int(previous.status) == FINALIZATION_ABSTAINED' in TEXT
    assert 'project.status = u8(STATUS_FINALIZATION_REQUESTED)' in TEXT


def test_validator_cannot_author_retrieval_provenance():
    assert '"memory_ids": [1,2]' not in TEXT
    assert 'result.get("memory_ids"' not in TEXT
    assert 'memory_ids = sorted(retrieved_memory_ids)' in TEXT
    assert 'record.overlap_refs_json = json.dumps(memory_ids' in TEXT
    assert "gl.eq_principle.prompt_comparative" not in TEXT
    assert "gl.vm.run_nondet_unsafe" in TEXT
    assert "_decision_candidates_equivalent(leader_candidate, validator_candidate, expected_pairs)" in TEXT


def test_empty_candidate_set_is_stored_as_empty_provenance():
    assert 'retrieved_memory_ids: set[int] = set()' in TEXT
    assert 'memory_ids = sorted(retrieved_memory_ids)' in TEXT
    assert 'json.dumps(memory_ids, separators=(",", ":"))' in TEXT


def test_candidate_retrieval_remains_namespace_filtered():
    assert 'if int(pointer.project_id) != project_id:' in TEXT
    assert 'if int(pointer.project_version) != int(project.version):' in TEXT
    assert 'if pointer.dimension_code != dimension_code:' in TEXT
    assert 'retrieved_memory_ids.add(int(row["checkpoint_id"]))' in TEXT


def test_consensus_payload_uses_actual_checkpoint_ids_not_local_positions():
    assert '"checkpoint_id": checkpoint_id' in TEXT
    assert 'for checkpoint_id, cp in zip(checkpoint_ids, checkpoints)' in TEXT
    assert 'for checkpoint_id, cp in zip(checkpoint_ids, checkpoints):\n                    text = gl.nondet.web.get(cp.artifact_url).body.decode("utf-8")' in TEXT
    assert 'f"checkpoint {checkpoint_id} evidence"' in TEXT
    assert 'cp.checkpoint_id' not in TEXT
    assert '"checkpoint_id": idx + 1' not in TEXT


def test_evidence_fetch_failure_is_explicit_and_distinct_from_abstention():
    assert '"reason": f"Public evidence unavailable: {str(exc)[:180]}"' in TEXT
    assert 'reason or "Validators abstained because evidence was insufficient."' in TEXT
    assert 'gl.nondet.web.get(record.release_url).body.decode("utf-8")' in TEXT
    assert 'gl.nondet.web.get(cp.artifact_url).body.decode("utf-8")' in TEXT


def test_no_private_key_or_server_signer_path_in_contract():
    lowered = TEXT.lower()
    assert "private_key" not in lowered
    assert "seed phrase" not in lowered
