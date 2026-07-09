from kubernetes_recovery import *

print(restart_deployment("frontend"))
print(scale_deployment("backend"))
print(rollback_deployment("frontend"))