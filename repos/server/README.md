# 🛍️ Storeways Server

Welcome to **Storeways Server**, the backend API powering Storeways — a modular e-commerce platform inspired by Shopify.  
This guide will help you quickly set up the server locally and get started with development.

---

## 🚀 Features

- Built with **Node.js + Express**
- Uses **PostgreSQL** with **Sequelize ORM**
- Secure authentication via **JWT + bcrypt**
- Extendable services with plugin system
- Environment-based service architecture
- Database migrations with **Umzug + Sequelize CLI**

---

## ⚙️ Requirements

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [yarn] (https://yarnpkg.com/getting-started/install)

---

## 🧰 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/storeways-server.git
cd storeways-server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/storeways
JWT_SECRET=supersecretkey
```

> 💡 You can also copy the included `.env.example` file and update it with your credentials.

---

### 4️⃣ Run database migrations

Initialize your database schema:

```bash
npm run migrate
```

---

### 5️⃣ Start the development server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:8080
```

---

## 🧱 Folder Structure

```
storeways-server/
│
├── src/
│   ├── app.js            # Entry point
│   ├── config/           # Database and environment configs
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── services/         # Helper services (storage, email, etc.)
│   ├── middleware/       # Auth, validation, etc.
│   └── utils/            # Helper functions
│
├── migrations/           # Database migration files
├── .env.example          # Example environment file
├── package.json
└── README.md
```

---

## 🧩 Available Scripts

| Script | Description |
|--------|--------------|
| `npm run dev` | Start development server (with nodemon) |
| `npm start` | Run production server |
| `npm run migrate` | Run database migrations |

---

## 📦 Deployment

When ready to deploy:

```bash
npm start
```

Make sure your production `.env` is configured properly and PostgreSQL is accessible.

---

## 💡 Need Help?

If you face any issues setting up Storeways Server, feel free to open an issue on GitHub or contact the maintainer.

---

## 👤 Author

**Sufiyaan Rajput**  
📧 [contact@example.com](mailto:contact@example.com)

---

## 📄 License

This project is licensed under the **MIT License**.
