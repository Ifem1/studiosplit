"""Reference tests for StudioSplit's deterministic largest-remainder arithmetic.

These tests intentionally do not claim GenVM execution; they verify the pure integer
algorithm mirrored by contracts/studiosplit.py while the GenLayer test runtime is absent.
"""

def normalize(scores: dict[str, int]) -> list[tuple[str, int]]:
    total = sum(scores.values())
    assert total > 0
    floors: dict[str, int] = {}
    remainders: list[tuple[int, str]] = []
    allocated = 0
    for wallet in sorted(scores):
        scaled = scores[wallet] * 10_000
        floors[wallet] = scaled // total
        allocated += floors[wallet]
        remainders.append((scaled % total, wallet))
    remainders.sort(key=lambda item: (-item[0], item[1]))
    for i in range(10_000 - allocated):
        floors[remainders[i][1]] += 1
    return [(wallet, floors[wallet]) for wallet in sorted(floors)]


def test_normalization_always_hits_exactly_10000_bps():
    for scores in [
        {"0xa": 1},
        {"0xa": 1, "0xb": 1, "0xc": 1},
        {"0xa": 190, "0xb": 178, "0xc": 119, "0xd": 79},
        {"0xa": 1, "0xb": 999_999},
    ]:
        assert sum(bps for _, bps in normalize(scores)) == 10_000


def test_tied_remainders_use_lexical_wallet_order():
    result = dict(normalize({"0xb": 1, "0xa": 1, "0xc": 1}))
    assert result == {"0xa": 3334, "0xb": 3333, "0xc": 3333}


def test_zero_score_matrix_abstains_instead_of_dividing():
    try:
        normalize({"0xa": 0, "0xb": 0})
    except AssertionError:
        pass
    else:
        raise AssertionError("all-zero scores must not normalize")
