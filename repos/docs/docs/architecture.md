---
id: architecture
title: Architecture Overview
---

Storeways is a pnpm‑managed monorepo with three primary apps and a plugin system.

## Monorepo

- Workspace root orchestrates scripts (install, dev, build)
- Each app is an isolated package under `repos/*`

```
repos/
├── server/   # Node/Express API + Sequelize
├── client/   # Next.js storefront
└── admin/    # React admin (CRA)
```

## Plugin System

Plugins enable optional integrations (e.g., storage, payments). They are declared via configuration and resolved at runtime with options.

For how to add or swap plugins in the Server (API), see [Plugins](./server/plugins).

## Environments

- Development: hot reload for all apps
- Production: build each app; start server with optimized Node runtime

## Data Layer

- PostgreSQL via Sequelize ORM
- Migrations managed in `repos/server/migrations`


