# SentinelOps AI

SentinelOps AI is an AI-powered incident detection and automated recovery system designed for Kubernetes-based applications.

## Project Overview

Modern cloud-native applications can experience failures such as:

- Pod crashes
- Service failures
- High resource utilization
- Application downtime

SentinelOps AI helps automate incident management by analyzing alerts, identifying root causes, triggering recovery actions, and maintaining incident history.

---
## Live Demo

Frontend Dashboard:

https://sentinelops-frontend-five.vercel.app/

---

## Features

- Alert Analysis
- Automated Recovery Actions
- Incident Logging
- Health Monitoring
- Statistics Dashboard Support
- Docker Support
- Kubernetes Ready Architecture

---

## Architecture

![Uploading architecture of sentinelops ai(1).png…]()


---

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### AI Engine
- Python
- FastAPI

### DevOps
- Docker
- Kubernetes

### Monitoring
- Prometheus
- Grafana

---

## API Endpoints

### Health Check

GET

```
/health
```

Response:

```json
{
  "status": "healthy"
}
```

### Incident Statistics

GET

```
/stats
```

### Incident History

GET

```
/incidents
```

### Process Alert

POST

```
/alert
```

Request:

```json
{
  "alertname": "PodCrashLooping"
}
```

Response:

```json
{
  "root_cause": "Container crash",
  "recovery_action": "restart deployment",
  "recovery_status": "Restarted deployment frontend"
}
```

---

## Running Locally

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start Application

```bash
uvicorn main:app --reload
```

### Swagger UI

```
http://127.0.0.1:8000/docs
```

---

## Docker

Build Image

```bash
docker build -t sentinel-ai .
```

Run Container

```bash
docker run -p 8000:8000 sentinel-ai
```

---

## Project Structure

```
SentinelOps-AI/
│
├── sentinel-ai/
│   ├── main.py
│   ├── analyzer.py
│   ├── logger.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── recovery-engine/
│   ├── recovery.py
│   └── kubernetes_recovery.py
│
├── frontend/
├── backend/
├── monitoring/
├── k8s/
├── docs/
└── README.md
```

---

## Future Enhancements

- Real Kubernetes API Integration
- Database Support (MySQL/PostgreSQL)
- Machine Learning Based Prediction
- Authentication and Authorization
- Multi-cluster Monitoring

