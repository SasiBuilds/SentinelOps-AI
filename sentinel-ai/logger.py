"""
SentinelOps AI – Incident Logger
Persists incident records to docs/incidents.json with file-level locking
to prevent JSON corruption under concurrent requests.
"""

import json
import os
import logging
from pathlib import Path
from filelock import FileLock, Timeout

# ---------------------------------------------------------------------------
# Configure Python logger for this module
# ---------------------------------------------------------------------------
log = logging.getLogger("sentinel-ai.logger")

# ---------------------------------------------------------------------------
# Resolve the incidents file path relative to this file's location so it
# works regardless of the working directory the process is launched from.
# ---------------------------------------------------------------------------
_BASE_DIR    = Path(__file__).resolve().parent.parent  # repo root
INCIDENTS_FILE = Path(os.getenv("INCIDENTS_FILE", str(_BASE_DIR / "docs" / "incidents.json")))
LOCK_FILE      = Path(str(INCIDENTS_FILE) + ".lock")
LOCK_TIMEOUT   = float(os.getenv("INCIDENTS_LOCK_TIMEOUT", "5"))  # seconds


def _ensure_file_exists() -> None:
    """Create the incidents file with an empty array if it doesn't exist."""
    INCIDENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not INCIDENTS_FILE.exists():
        INCIDENTS_FILE.write_text("[]", encoding="utf-8")


def save_incident(data: dict) -> None:
    """
    Append a new incident record to the incidents JSON file.
    Uses a file lock to prevent race conditions under concurrent writes.

    Args:
        data: Incident dict to append.

    Raises:
        Timeout: If the lock cannot be acquired within LOCK_TIMEOUT seconds.
    """
    _ensure_file_exists()

    lock = FileLock(str(LOCK_FILE), timeout=LOCK_TIMEOUT)

    try:
        with lock:
            # Read current incidents
            try:
                content = INCIDENTS_FILE.read_text(encoding="utf-8").strip()
                incidents: list = json.loads(content) if content else []
            except (json.JSONDecodeError, ValueError):
                log.warning("incidents.json was malformed – resetting to empty list.")
                incidents = []

            incidents.append(data)

            # Write atomically: write to temp file, then rename
            tmp_file = INCIDENTS_FILE.with_suffix(".tmp")
            tmp_file.write_text(json.dumps(incidents, indent=4), encoding="utf-8")
            tmp_file.replace(INCIDENTS_FILE)

    except Timeout:
        log.error(
            "Could not acquire lock on incidents.json within %s seconds.", LOCK_TIMEOUT
        )
        raise


def load_incidents() -> list:
    """
    Read and return all incident records.

    Returns:
        List of incident dicts. Returns [] if file is missing or malformed.
    """
    _ensure_file_exists()

    lock = FileLock(str(LOCK_FILE), timeout=LOCK_TIMEOUT)

    try:
        with lock:
            content = INCIDENTS_FILE.read_text(encoding="utf-8").strip()
            if not content:
                return []
            return json.loads(content)
    except (json.JSONDecodeError, ValueError):
        log.warning("incidents.json is malformed – returning empty list.")
        return []
    except Timeout:
        log.error("Could not acquire read lock on incidents.json.")
        return []
