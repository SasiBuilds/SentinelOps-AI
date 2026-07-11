from kubernetes_recovery import (
    restart_deployment,
    scale_deployment,
    rollback_deployment,
)


def test_restart_deployment():
    assert restart_deployment("frontend") == "Restarted deployment frontend"


def test_scale_deployment():
    assert (
        scale_deployment("backend")
        == "Scaled deployment backend to 3 replicas"
    )


def test_rollback_deployment():
    assert rollback_deployment("frontend") == "Rolled back deployment frontend"