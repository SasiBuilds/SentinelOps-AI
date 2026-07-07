from fastapi import FastAPI
from analyzer import analyze
import sys
import os

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

    return {
        "root_cause": result["cause"],
        "recovery_action": result["action"],
        "recovery_status": recovery_result
    }