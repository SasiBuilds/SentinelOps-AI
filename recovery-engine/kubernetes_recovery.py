def restart_deployment(name):
    return f"Restarted deployment {name}"

def scale_deployment(name, replicas=3):
    return f"Scaled deployment {name} to {replicas} replicas"

def rollback_deployment(name):
    return f"Rolled back deployment {name}"