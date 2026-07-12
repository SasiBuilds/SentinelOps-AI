def analyze(alertname):

    mapping = {
        "PodCrashLooping": {
            "cause": "Container crash",
            "action": "restart deployment",
            "severity": "critical",
        },
        "HighCPUUsage": {
            "cause": "Resource exhaustion",
            "action": "scale deployment",
            "severity": "warning",
        },
        "ImagePullBackOff": {
            "cause": "Container image issue",
            "action": "rollback deployment",
            "severity": "critical",
        },
        "OOMKilled": {
            "cause": "Memory limit exceeded",
            "action": "increase memory limits",
            "severity": "critical",
        },
    }

    return mapping.get(
        alertname,
        {"cause": "Unknown", "action": "manual investigation", "severity": "unknown"},
    )
