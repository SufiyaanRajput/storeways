# 🏪 Storeways — Open Source E-Commerce Platform

**Storeways** is an open-source, monorepo built for modern commerce.  
It’s designed for developers who want full control over their stack — from backend APIs to frontend storefronts and admin dashboards.

Storeways is modular, extensible, and easy to self-host.  
Built with **pnpm workspaces**, **Node.js**, and a plugin-based architecture for flexibility.

Non binding so you dont get stuck in the docs forever

---

## 🚀 Features

- **🧱 Modular Monorepo** — all apps managed with `pnpm`
- **⚙️ Plugin System** — easily integrate storage, payment gateways, and more
- **🖥️ Storefront (Client)** — user-facing shop built ready to use
- **🛠️ Admin Dashboard** — manage products, orders, and customers
- **🗄️ Server API** — Node/Express backend with Babel, dotenv, and migration support
- **📦 Ready for OSS Deployment** — works with Amplify, Render, Netlify, or Railway

---

## 🏗️ Monorepo Structure

```
storeways/
├── repos/
│   ├── server/       # Express + Babel backend API
│   ├── client/       # Frontend storefront
│   └── admin/     # Admin dashboard
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 20.x  
- **Corepack** enabled (for pnpm)  
- **pnpm** (auto-activated via Corepack)

Enable Corepack if not already:

```terminal
corepack enable
```

---

## 🧩 Setup

To install dependencies and run database migrations:

```bash
pnpm setup-p
```

This will:
1. Install all workspace dependencies
2. Run the `migrate` script in the `server` workspace with streaming logs

---

## 💻 Development

### Run everything
```terminal
pnpm dev
```

Runs all apps (`server`, `client`, and `admin`) in parallel with live logs.

### Run only the server
```terminal
pnpm dev:server
```

### Run only the client
```terminal
pnpm dev:client
```

### Run only the admin dashboard
```terminal
pnpm dev:admin
```

---

## 🛠️ Scripts

| Script | Description |
|--------|--------------|
| `pnpm setup-p` | Install dependencies and run migrations |
| `pnpm dev` | Run all apps in parallel (streamed logs) |
| `pnpm dev:server` | Run the backend API only |
| `pnpm dev:client` | Run the storefront only |
| `pnpm dev:admin` | Run the admin dashboard only |
| `pnpm start:server` | Start server in production |

---

## 🧰 Tech Stack

| Layer | Stack |
|-------|--------|
| Backend | Node.js, Express, Babel |
| Frontend | React / Next.js |
| Admin | React |
| Package Manager | pnpm (monorepo) |
| Recommended Deployment | Any cloud service (Server), Vercel (Client), Amplify (Admin) |

---

## 🧩 Plugin Architecture

Storeways uses a modular plugin system:
- Each plugin (e.g., storage, payments) can be registered via `config.plugins`
- Example config:
  ```js
  const config = {
    plugins: [
      {
        resolve: "./plugins/storage/local.js",
        options: { uploadDir: "uploads" },
      },
      {
        resolve: "./plugins/payments/stripe.js",
        options: { apiKey: process.env.STRIPE_KEY },
      },
    ],
  };
  export default config;
  ```

---

## 🧑‍💻 Contributing

Contributions are welcome!  
You can:
- Open issues for bugs or features  
- Fork the repo and submit a PR  
- Add new plugins (storage, payment, analytics, etc.)  

Before contributing:
```terminal
pnpm setup-p
pnpm dev:server
```

---

## 🧾 License

Licensed under the **MIT License** — free to use, modify, and distribute.

---

## 📬 Community

- 🐛 Issues: [GitHub Issues](https://github.com/SufiyaanRajput/storeways/issues)
- 🌐 Website: https://sufiyaanrajput.github.io/storeways/
- Discord: https://discord.gg/Cyddxr25

---

---

Made with ❤️ for the open-source community.
