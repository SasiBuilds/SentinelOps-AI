from fastapi import FastAPI
from analyzer import analyze
from logger import save_incident
import sys
import os
import json

sys.path.append(
    os.path.abspath("../recovery-engine")
)

from recovery import recover

app = FastAPI()

@app.get("/")
def home():
    return {
        "service": "SentinelOps AI",
        "status": "running"
    }

@app.post("/alert")
def receive_alert(alert: dict):

    result = analyze(
        alert.get("alertname")
    )

    recovery_result = recover(
        result["action"]
    )

    incident = {
        "alert": alert.get("alertname"),
        "root_cause": result["cause"],
        "recovery_action": result["action"],
        "recovery_status": recovery_result
    }

    save_incident(incident)

    return incident


@app.get("/incidents")
def incidents():

    try:
        with open("../docs/incidents.json", "r") as f:
            return json.load(f)

    except:
        return []