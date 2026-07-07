def analyze(alertname):

    mapping = {
        "PodCrashLooping": {
            "cause": "Container crash",
            "action": "restart deployment"
        },

        "HighCPUUsage": {
            "cause": "High resource consumption",
            "action": "scale deployment"
        },

        "PodDown": {
            "cause": "Pod unavailable",
            "action": "restart pod"
        }
    }

    return mapping.get(
        alertname,
        {
            "cause": "Unknown",
            "action": "manual investigation"
        }
    )