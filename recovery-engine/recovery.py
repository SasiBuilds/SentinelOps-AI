"""
SentinelOps AI – Recovery Dispatcher
Routes an action string to the correct Kubernetes recovery function.
The target service name is now a parameter (no more hardcoded "frontend").
"""

import logging
import os

from kubernetes_recovery import (
    restart_deployment,
    scale_deployment,
    rollback_deployment,
)

log = logging.getLogger("sentinel-ai.recovery")

# Default namespace for Kubernetes operations
DEFAULT_NAMESPACE = os.getenv("K8S_NAMESPACE", "default")
# Default scale replica count when scaling up
DEFAULT_REPLICAS = int(os.getenv("RECOVERY_DEFAULT_REPLICAS", "3"))


def recover(action: str, service: str | None = None, namespace: str | None = None) -> str:
    """
    Dispatch a recovery action to the appropriate Kubernetes function.

    Args:
        action:    One of the recovery action strings produced by the analyzer.
        service:   The Kubernetes deployment name to act upon.
                   Falls back to the K8S_DEFAULT_SERVICE env var, then "unknown-service".
        namespace: The Kubernetes namespace. Falls back to DEFAULT_NAMESPACE.

    Returns:
        A human-readable result string from the executed recovery function.
    """
    # Resolve target service – never fall back to a hardcoded service name
    target_service = (
        service
        or os.getenv("K8S_DEFAULT_SERVICE")
        or "unknown-service"
    )
    target_namespace = namespace or DEFAULT_NAMESPACE

    if not service:
        log.warning(
            "recover() called without a service name. Using fallback: '%s'",
            target_service,
        )

    action_lower = action.lower().strip()

    if action_lower == "restart deployment":
        return restart_deployment(target_service, target_namespace)

    elif action_lower == "scale deployment":
        return scale_deployment(target_service, target_namespace, replicas=DEFAULT_REPLICAS)

    elif action_lower == "rollback deployment":
        return rollback_deployment(target_service, target_namespace)

    elif action_lower in ("notify", "manual investigation"):
        msg = (
            f"Manual intervention required for service '{target_service}'. "
            f"Action requested: '{action}'."
        )
        log.info(msg)
        return msg

    else:
        msg = f"Unknown action '{action}' for service '{target_service}'. Manual intervention required."
        log.warning(msg)
        return msg
