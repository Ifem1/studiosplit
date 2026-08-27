"""Test-environment compatibility for the official direct GenLayer runtime.

gltest 0.29.2 closes a temporary stdin descriptor and immediately unlinks the
file. Windows rejects that unlink while the descriptor is still inherited by
the VM. Ignore only that specific temporary-file cleanup error; the runtime
itself and all contract assertions remain unmodified.
"""
import os
from pathlib import Path
import tempfile


if os.name == "nt":
    _unlink = os.unlink

    def _windows_safe_unlink(path, *args, **kwargs):
        try:
            return _unlink(path, *args, **kwargs)
        except PermissionError:
            candidate = Path(path)
            if candidate.parent == Path(tempfile.gettempdir()) and candidate.name.startswith("tmp"):
                return None
            raise

    os.unlink = _windows_safe_unlink
