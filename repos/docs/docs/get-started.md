---
id: get-started
title: Getting Started
---

## Prerequisites

- Node.js ≥ 20
- Corepack enabled (for pnpm)
- pnpm (managed by Corepack)

Enable Corepack:

```bash
corepack enable
```

## Install and Setup

From the monorepo root:

```bash
pnpm setup-p
```

This will:
1. Install dependencies across all workspaces
2. Run server database migrations

## Run in Development

Run everything:

```bash
pnpm dev
```

Run a single app:

```bash
pnpm dev:server   # backend API on http://localhost:4000
pnpm dev:client   # storefront on http://localhost:3000
pnpm dev:admin    # admin on http://localhost:3001
```

## Production Builds

```bash
pnpm build            # build all workspaces
pnpm start:server     # start server in production
```

## Project Structure

```
storeways/
├── repos/
│   ├── server/   # Express backend
│   ├── client/   # Next.js storefront
│   └── admin/    # React admin
├── pnpm-workspace.yaml
└── package.json
```


