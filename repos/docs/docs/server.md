---
id: server
title: Server (API)
---

The Server is a Node.js + Express API with PostgreSQL via Sequelize.

## Environment

Create `.env` in `repos/server` (example keys):

```bash
DATABASE_URL=postgres://user:password@localhost:5432/storeways
JWT_SECRET=supersecretkey
```

## Migrations

```bash
pnpm --filter server run migrate
```

## Run Locally

```bash
pnpm dev:server
```

Default URL:

```
http://localhost:4000
```

## Scripts

- `dev`: start dev server with live reload
- `start`: start production server
- `migrate`: run database migrations

## API Overview

The Storeways API is served by the Server app (`repos/server`). Explore the routes under:

- `repos/server/src/api`
- `repos/server/src/services`

Swagger/OpenAPI integration is available via `repos/server/swagger.js`. When the server is running, check the configured route (if enabled) to browse endpoints.

Common resources:
- Auth, Users
- Products, Categories, Variations
- Orders, Payments
- Reviews, Newsletters

For detailed usage, inspect controllers/services in the server codebase and the migrations to understand the schema.


