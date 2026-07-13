# src/models

Prisma is the single source of truth for all database models.
Define your data models in `prisma/schema.prisma`.

After adding or updating a model:
```bash
npm run db:generate   # regenerate the Prisma client
npm run db:migrate    # create and apply a migration (dev)
```

This directory is reserved for any additional plain JavaScript model helpers,
type definitions, or data-transformation objects that complement the Prisma
generated types. For example:

- `incident.model.js`  – DTO builders and serialisers for the Incident entity
- `alert.model.js`     – DTO builders for the Alert entity

Add files here as feature modules are implemented.
