# src/services

Business-logic layer.  Controllers are kept thin; all database access and
domain rules live in service files.

Each service module:
- Imports `prisma` from `../database/index.js`
- Throws `AppError` subclasses for domain errors
- Is fully unit-testable without an HTTP context

Service files will be added here as feature modules are implemented:

- `incident.service.js`   – CRUD + lifecycle for incidents
- `alert.service.js`      – Alert ingestion and deduplication
- `recovery.service.js`   – Recovery action orchestration
- `health.service.js`     – System health aggregation (already implemented)
