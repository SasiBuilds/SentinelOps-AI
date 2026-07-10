"""
SentinelOps AI – Recovery Engine Healthcheck
Can be invoked as a standalone script to verify that the recovery module
and its dependencies are importable and functional.

Exit codes:
  0 – healthy
  1 – unhealthy (imports failed or stub calls raised exceptions)

Usage:
  python healthcheck.py
"""

import sys
import traceback


def run_healthcheck() -> bool:
    """
    Validate that all recovery-engine modules are importable and
    that stub calls complete without exceptions.

    Returns:
        True if healthy, False otherwise.
    """
    errors: list[str] = []

    # ── Check imports ──────────────────────────────────────────────────────
    try:
        from kubernetes_recovery import restart_deployment, scale_deployment, rollback_deployment
    except Exception:
        errors.append(f"Import error – kubernetes_recovery:\n{traceback.format_exc()}")

    try:
        from recovery import recover
    except Exception:
        errors.append(f"Import error – recovery:\n{traceback.format_exc()}")

    if errors:
        for err in errors:
            print(f"[FAIL] {err}", file=sys.stderr)
        return False

    # ── Exercise stub calls ────────────────────────────────────────────────
    try:
        result = restart_deployment("healthcheck-test", "default")
        assert "healthcheck-test" in result, f"Unexpected result: {result}"

        result = scale_deployment("healthcheck-test", "default", replicas=2)
        assert "healthcheck-test" in result, f"Unexpected result: {result}"

        result = rollback_deployment("healthcheck-test", "default")
        assert "healthcheck-test" in result, f"Unexpected result: {result}"

        result = recover("restart deployment", "healthcheck-test")
        assert "healthcheck-test" in result, f"Unexpected result: {result}"

    except Exception:
        errors.append(f"Runtime error:\n{traceback.format_exc()}")

    if errors:
        for err in errors:
            print(f"[FAIL] {err}", file=sys.stderr)
        return False

    print("[OK] Recovery engine healthcheck passed.", file=sys.stdout)
    return True


if __name__ == "__main__":
    ok = run_healthcheck()
    sys.exit(0 if ok else 1)
