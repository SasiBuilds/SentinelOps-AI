import sys
import os
import json

from fastapi import FastAPI
from analyzer import analyze
from logger import save_incident

sys.path.insert(0, os.path.abspath("../recovery-engine"))
from recovery import recover  # noqa: E402

app = FastAPI()


@app.get("/")
def home():
    return {"service": "SentinelOps AI", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/alert")
def receive_alert(alert: dict):

    result = analyze(alert.get("alertname"))

    recovery_result = recover(result["action"])

    incident = {
        "alert": alert.get("alertname"),
        "root_cause": result["cause"],
        "recovery_action": result["action"],
        "recovery_status": recovery_result,
    }

    save_incident(incident)

    return incident


@app.get("/incidents")
def incidents():

    try:
        with open("../docs/incidents.json", "r") as f:
            return json.load(f)

    except Exception:
        return []


@app.get("/stats")
def stats():

    try:
        with open("../docs/incidents.json", "r") as f:
            incidents = json.load(f)

        return {"service": "SentinelOps AI", "total_incidents": len(incidents)}

    except Exception:
        return {"service": "SentinelOps AI", "total_incidents": 0}
    