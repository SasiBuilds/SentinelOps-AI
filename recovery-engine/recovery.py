from kubernetes_recovery import (
    restart_deployment,
    scale_deployment,
    rollback_deployment
)


def recover(action):

    if action == "restart deployment":
        return restart_deployment("frontend")

    elif action == "scale deployment":
        return scale_deployment("frontend")

    elif action == "rollback deployment":
        return rollback_deployment("frontend")

    return "Manual intervention required"