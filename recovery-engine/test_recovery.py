"""
SentinelOps AI – Recovery Engine Tests
Unit tests for kubernetes_recovery and recovery dispatcher.
Run with: python -m pytest test_recovery.py -v
   or:    python test_recovery.py
"""

import sys
import os


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _assert(condition: bool, message: str) -> None:
    if not condition:
        print(f"  [FAIL] {message}", file=sys.stderr)
        sys.exit(1)
    print(f"  [PASS] {message}")


# ---------------------------------------------------------------------------
# Tests for kubernetes_recovery (stub mode, USE_REAL_K8S=false)
# ---------------------------------------------------------------------------

def test_restart_deployment():
    from kubernetes_recovery import restart_deployment

    result = restart_deployment("my-service", "production")
    _assert("my-service" in result, f"restart_deployment includes service name: {result!r}")
    _assert("production" in result, f"restart_deployment includes namespace: {result!r}")


def test_restart_deployment_missing_name():
    from kubernetes_recovery import restart_deployment

    result = restart_deployment("", "default")
    _assert("Error" in result or "required" in result.lower(),
            f"restart_deployment rejects empty name: {result!r}")


def test_scale_deployment():
    from kubernetes_recovery import scale_deployment

    result = scale_deployment("my-service", "default", replicas=5)
    _assert("my-service" in result, f"scale_deployment includes service name: {result!r}")
    _assert("5" in result, f"scale_deployment includes replica count: {result!r}")


def test_scale_deployment_negative_replicas():
    from kubernetes_recovery import scale_deployment

    result = scale_deployment("my-service", "default", replicas=-1)
    _assert("Error" in result or "non-negative" in result.lower(),
            f"scale_deployment rejects negative replicas: {result!r}")


def test_rollback_deployment():
    from kubernetes_recovery import rollback_deployment

    result = rollback_deployment("my-service", "staging")
    _assert("my-service" in result, f"rollback_deployment includes service name: {result!r}")
    _assert("staging" in result, f"rollback_deployment includes namespace: {result!r}")


# ---------------------------------------------------------------------------
# Tests for recovery dispatcher
# ---------------------------------------------------------------------------

def test_recover_restart():
    from recovery import recover
    result = recover("restart deployment", "frontend")
    _assert("frontend" in result, f"recover restart: {result!r}")


def test_recover_scale():
    from recovery import recover
    result = recover("scale deployment", "backend")
    _assert("backend" in result, f"recover scale: {result!r}")


def test_recover_rollback():
    from recovery import recover
    result = recover("rollback deployment", "api-server")
    _assert("api-server" in result, f"recover rollback: {result!r}")


def test_recover_manual():
    from recovery import recover
    result = recover("manual investigation", "worker")
    _assert("worker" in result, f"recover manual: {result!r}")
    _assert("Manual" in result or "manual" in result.lower(), f"recover manual text: {result!r}")


def test_recover_unknown_action():
    from recovery import recover
    result = recover("fly to the moon", "rocket")
    _assert("Unknown" in result or "unknown" in result.lower(),
            f"recover handles unknown action: {result!r}")


def test_recover_no_service_uses_fallback():
    """When no service is provided, recover() should not crash."""
    from recovery import recover
    result = recover("restart deployment", None)
    _assert(isinstance(result, str) and len(result) > 0,
            f"recover no-service returns a string: {result!r}")


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    tests = [
        test_restart_deployment,
        test_restart_deployment_missing_name,
        test_scale_deployment,
        test_scale_deployment_negative_replicas,
        test_rollback_deployment,
        test_recover_restart,
        test_recover_scale,
        test_recover_rollback,
        test_recover_manual,
        test_recover_unknown_action,
        test_recover_no_service_uses_fallback,
    ]

    print(f"\nRunning {len(tests)} recovery engine tests...\n")
    for test_fn in tests:
        print(f"Running {test_fn.__name__}:")
        test_fn()

    print(f"\nAll {len(tests)} tests passed.")
