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

## Multi-tenant local subdomain

Storeways uses a multi-tenant architecture with subdomain-based tenant resolution. For local development, access the storefront via a subdomain (e.g., `store.localhost.com`) so the host header includes a tenant.

Default subdomain in the setup is `store`.

Add an entry to your `/etc/hosts` pointing a subdomain to your local IP:

```bash
sudo sh -c 'echo "127.0.0.1 store.localhost.com" >> /etc/hosts'
```

Then use the subdomain with the relevant dev ports:

- Client: `http://store.localhost.com:3000`
- Admin: `localhost:3001`
- API: `localhost:8080`

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


