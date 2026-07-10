"""
SentinelOps AI – Kubernetes Recovery Engine
Provides functions to restart, scale, and roll back Kubernetes deployments.

In production, set USE_REAL_K8S=true and configure kubeconfig/in-cluster auth.
When USE_REAL_K8S is false (default) the functions return human-readable stub
strings so the service can be developed and tested without a live cluster.
"""

import logging
import os

log = logging.getLogger("sentinel-ai.recovery")

# Set USE_REAL_K8S=true in production to enable real Kubernetes API calls.
_USE_REAL_K8S = os.getenv("USE_REAL_K8S", "false").lower() == "true"

# ---------------------------------------------------------------------------
# Real Kubernetes implementation (guarded behind the env flag)
# ---------------------------------------------------------------------------
if _USE_REAL_K8S:
    try:
        from kubernetes import client as k8s_client, config as k8s_config  # type: ignore

        try:
            k8s_config.load_incluster_config()
        except Exception:
            k8s_config.load_kube_config()

        _apps_v1 = k8s_client.AppsV1Api()
        log.info("Kubernetes client initialised (in-cluster or kubeconfig).")
    except ImportError as exc:
        log.warning(
            "kubernetes package not installed – falling back to stub mode. "
            "Install with: pip install kubernetes"
        )
        _USE_REAL_K8S = False


# ---------------------------------------------------------------------------
# Public functions
# ---------------------------------------------------------------------------

def restart_deployment(name: str, namespace: str = "default") -> str:
    """
    Restart a Kubernetes deployment by patching its template annotation
    with the current timestamp (forces a rolling restart).
    """
    if not name:
        return "Error: deployment name is required."

    if _USE_REAL_K8S:
        import datetime
        body = {
            "spec": {
                "template": {
                    "metadata": {
                        "annotations": {
                            "kubectl.kubernetes.io/restartedAt": datetime.datetime.utcnow().isoformat()
                        }
                    }
                }
            }
        }
        try:
            _apps_v1.patch_namespaced_deployment(name=name, namespace=namespace, body=body)
            log.info("Restarted deployment %s in namespace %s", name, namespace)
            return f"Deployment '{name}' restarted successfully in namespace '{namespace}'."
        except Exception as exc:
            log.error("Failed to restart deployment %s: %s", name, exc)
            return f"Error restarting deployment '{name}': {exc}"

    # Stub
    log.info("[STUB] Restarted deployment %s in namespace %s", name, namespace)
    return f"[STUB] Restarted deployment '{name}' in namespace '{namespace}'."


def scale_deployment(name: str, namespace: str = "default", replicas: int = 3) -> str:
    """
    Scale a Kubernetes deployment to the specified replica count.
    """
    if not name:
        return "Error: deployment name is required."
    if replicas < 0:
        return "Error: replica count must be non-negative."

    if _USE_REAL_K8S:
        body = {"spec": {"replicas": replicas}}
        try:
            _apps_v1.patch_namespaced_deployment_scale(name=name, namespace=namespace, body=body)
            log.info("Scaled deployment %s to %d replicas in namespace %s", name, replicas, namespace)
            return f"Deployment '{name}' scaled to {replicas} replicas in namespace '{namespace}'."
        except Exception as exc:
            log.error("Failed to scale deployment %s: %s", name, exc)
            return f"Error scaling deployment '{name}': {exc}"

    # Stub
    log.info("[STUB] Scaled deployment %s to %d replicas in namespace %s", name, replicas, namespace)
    return f"[STUB] Scaled deployment '{name}' to {replicas} replicas in namespace '{namespace}'."


def rollback_deployment(name: str, namespace: str = "default") -> str:
    """
    Roll back a Kubernetes deployment to the previous revision.
    Implemented via a Rollout Undo patch on the deployment annotation.
    """
    if not name:
        return "Error: deployment name is required."

    if _USE_REAL_K8S:
        body = {
            "spec": {
                "rollbackTo": {"revision": 0}  # 0 means previous revision
            }
        }
        try:
            _apps_v1.patch_namespaced_deployment(name=name, namespace=namespace, body=body)
            log.info("Rolled back deployment %s in namespace %s", name, namespace)
            return f"Deployment '{name}' rolled back to previous revision in namespace '{namespace}'."
        except Exception as exc:
            log.error("Failed to roll back deployment %s: %s", name, exc)
            return f"Error rolling back deployment '{name}': {exc}"

    # Stub
    log.info("[STUB] Rolled back deployment %s in namespace %s", name, namespace)
    return f"[STUB] Rolled back deployment '{name}' to previous revision in namespace '{namespace}'."
