from kubernetes_recovery import *

def recover(action):

    if action == "restart deployment":
        return restart_deployment("frontend")

    elif action == "scale deployment":
        return scale_deployment("frontend")

    elif action == "rollback deployment":
        return rollback_deployment("frontend")

    return "Manual intervention required"