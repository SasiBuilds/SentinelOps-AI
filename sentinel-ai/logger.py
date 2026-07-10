import json
import os

FILE = "../docs/incidents.json"

def save_incident(data):

    incidents = []

    if os.path.exists(FILE):
        with open(FILE, "r") as f:
            try:
                incidents = json.load(f)
            except:
                incidents = []

    incidents.append(data)

    with open(FILE, "w") as f:
        json.dump(incidents, f, indent=4)