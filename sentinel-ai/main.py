from fastapi import FastAPI
from analyzer import analyze

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

    return {
        "root_cause": result["cause"],
        "recovery_action": result["action"]
    }