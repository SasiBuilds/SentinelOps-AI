from kubernetes_recovery import (
    restart_deployment,
    scale_deployment,
    rollback_deployment,
)

print(restart_deployment("frontend"))
print(scale_deployment("backend"))
print(rollback_deployment("frontend"))
