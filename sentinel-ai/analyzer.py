"""
SentinelOps AI – Alert Analyzer
Maps incoming alertname values to root-cause analysis and recovery actions.
"""

from typing import TypedDict


class AnalysisResult(TypedDict):
    cause: str
    action: str
    severity: str


# Mapping of alert names → analysis results
ALERT_MAPPING: dict[str, AnalysisResult] = {
    "PodCrashLooping": {
        "cause": "Container crash – application is repeatedly exiting",
        "action": "restart deployment",
        "severity": "critical",
    },
    "HighCPUUsage": {
        "cause": "Resource exhaustion – CPU usage exceeds threshold",
        "action": "scale deployment",
        "severity": "warning",
    },
    "HighMemoryUsage": {
        "cause": "Resource exhaustion – memory usage exceeds threshold",
        "action": "scale deployment",
        "severity": "warning",
    },
    "ImagePullBackOff": {
        "cause": "Container image pull failure – bad tag or registry issue",
        "action": "rollback deployment",
        "severity": "critical",
    },
    "OOMKilled": {
        "cause": "Out-of-memory kill – container exceeded memory limit",
        "action": "scale deployment",
        "severity": "critical",
    },
    "NodeNotReady": {
        "cause": "Kubernetes node is not in Ready state",
        "action": "restart deployment",
        "severity": "critical",
    },
    "PodPending": {
        "cause": "Pod is stuck in Pending – insufficient cluster resources",
        "action": "scale deployment",
        "severity": "warning",
    },
    "DeploymentReplicasMismatch": {
        "cause": "Desired replica count does not match available replicas",
        "action": "restart deployment",
        "severity": "warning",
    },
    "ServiceDown": {
        "cause": "Service endpoints are unavailable",
        "action": "restart deployment",
        "severity": "critical",
    },
}

DEFAULT_RESULT: AnalysisResult = {
    "cause": "Unknown – no matching alert pattern found",
    "action": "manual investigation",
    "severity": "unknown",
}


def analyze(alertname: str | None) -> AnalysisResult:
    """
    Analyse an alert name and return a root-cause + recovery recommendation.

    Args:
        alertname: The Prometheus / custom alert name string.

    Returns:
        AnalysisResult with cause, action, and severity fields.
    """
    if not alertname:
        return DEFAULT_RESULT
    return ALERT_MAPPING.get(alertname, DEFAULT_RESULT)
