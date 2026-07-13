# SentinelOps AI – Backend API

> Autonomous Disaster Detection & Recovery Platform – REST API

SentinelOps AI is a backend service for an AI-powered disaster detection and recovery platform. It provides APIs for incident management, alert processing, authentication, recovery tracking, and integration with AI services.

---

# Tech Stack

| Layer             | Technology               |
| ----------------- | ------------------------ |
| Runtime           | Node.js 20+              |
| Framework         | Express.js               |
| Database          | PostgreSQL               |
| ORM               | Prisma                   |
| Authentication    | JWT + bcryptjs           |
| Validation        | express-validator        |
| Logging           | Winston + Morgan         |
| API Documentation | Swagger UI (OpenAPI 3.0) |
| Deployment        | Render                   |
| Containerization  | Docker                   |

---

# Features

* RESTful API architecture
* User authentication with JWT
* Role-based access control (ADMIN, OPERATOR, VIEWER)
* Incident management
* Alert ingestion and tracking
* Recovery action management
* PostgreSQL database integration
* Prisma ORM migrations
* Swagger API documentation
* Production deployment support
* Optional AI service integration

---

# Project Structure

```
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── database/
│   ├── config/
│   └── logger/
│
├── server.js
├── package.json
├── Dockerfile
└── .env.example
```

---

# Prerequisites

Required:

* Node.js 20+
* npm 10+
* PostgreSQL 15+

---

# Installation

Clone the repository:

```bash
git clone https://github.com/SasiBuilds/SentinelOps-AI.git
```

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# Environment Configuration

Create environment file:

```bash
cp .env.example .env
```

Configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sentinelops?schema=public"

JWT_SECRET="your_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret"

PORT=5000
NODE_ENV=development
```

---

# Database Setup

Generate Prisma client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Open Prisma Studio:

```bash
npm run db:studio
```

---

# Running the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```
http://localhost:5000
```

---

# API Documentation

Swagger UI:

```
http://localhost:5000/api-docs
```

---

# API Endpoints

Base URL:

```
/api/v1
```

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | /health        | Server health check  |
| POST   | /auth/register | Register user        |
| POST   | /auth/login    | User login           |
| GET    | /auth/me       | Current user         |
| GET    | /incidents     | List incidents       |
| POST   | /incidents     | Create incident      |
| GET    | /alerts        | List alerts          |
| POST   | /alerts        | Create alert         |
| GET    | /recovery      | Recovery records     |
| POST   | /recovery      | Trigger recovery     |
| GET    | /stats         | Dashboard statistics |

---

# Deployment

Backend is deployed on Render.

Production URL:

```
https://sentinelops-ai-backend.onrender.com
```

Health Check:

```
https://sentinelops-ai-backend.onrender.com/api/v1/health
```

Deployment status:

* ✅ Backend server running
* ✅ PostgreSQL connected
* ✅ Prisma connected
* ✅ Production environment enabled
* ✅ Health API verified

---

# Environment Variables

| Variable           | Description                  |
| ------------------ | ---------------------------- |
| DATABASE_URL       | PostgreSQL connection string |
| PORT               | Server port                  |
| NODE_ENV           | Environment mode             |
| JWT_SECRET         | JWT access token secret      |
| JWT_REFRESH_SECRET | Refresh token secret         |
| CORS_ORIGIN        | Allowed frontend origin      |
| AI_SERVICE_URL     | Optional AI service URL      |
| SWAGGER_ENABLED    | Enable Swagger documentation |

---

# Common Issues

### Database connection error

```
Can't reach database server at localhost:5432
```

Solution:

* Start PostgreSQL
* Check DATABASE_URL
* Verify database credentials

### AI Service unavailable

```
aiService: unavailable
```

This is expected when the separate AI service is not deployed. Backend continues working normally.

---

# Available Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| npm run dev         | Start development server |
| npm start           | Start production server  |
| npm run db:generate | Generate Prisma client   |
| npm run db:migrate  | Run migrations           |
| npm run db:studio   | Open Prisma Studio       |
| npm run lint        | Run ESLint               |

---

# Architecture

* MVC architecture
* Express.js REST API
* Prisma ORM database layer
* Centralized configuration management
* Middleware-based error handling
* JWT authentication
* Role-based authorization
* Graceful server shutdown
* Structured logging

---

# License

MIT License
