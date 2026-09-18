# APMS — Army Personnel Management System

A complete academic/project demonstration of a centralized Army Personnel Management System using fictional data only.

## A. Selected technology stack

- **Next.js 15 + React 19** — full-stack web application with one deployable application.
- **Node.js** — runtime.
- **PostgreSQL** — managed relational cloud database.
- **pg** — direct, lightweight PostgreSQL data access.
- **bcryptjs** — password hashing.
- **jose** — signed HTTP-only JWT session cookie.
- **Plain CSS** — polished responsive UI without a heavy component framework.

## B. Why this stack

The application deliberately avoids separate frontend/backend services. Next.js hosts the UI and API routes together, while PostgreSQL supplies persistent cloud data. This keeps deployment simple: one web service plus one managed database, with all environment-specific values in deployment settings.

## Features

- Secure login/logout and protected routes
- PERSONNEL and ADMIN roles
- Personnel dashboard
- Personal details CRUD
- Family CRUD
- Leave submission, history, approval and rejection
- Current posting and posting history
- Documents metadata and cloud-compatible storage reference
- Awards
- Payment/salary-slip records
- Admin personnel search/filter and management
- Validation, loading states, empty states, alerts and confirmations
- Responsive desktop/tablet/mobile layout
- `/api/health` health check
- SQL schema and idempotent migration command
- Fictional demo seed data
- GitHub/deployment-ready configuration

## Architecture

```text
Browser
   │
   ▼
Next.js application (UI + API routes)
   │
   │ DATABASE_URL
   ▼
Managed PostgreSQL
```

## Folder structure

```text
apms/
├─ app/
│  ├─ api/                 # Authentication, health and CRUD API routes
│  ├─ dashboard/admin/     # Admin dashboard
│  ├─ dashboard/personnel/ # Personnel dashboard
│  ├─ login/               # Login page
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ components/             # UI and dashboard components
├─ db/
│  ├─ schema.sql
│  └─ er-diagram.md
├─ lib/
│  ├─ auth.js
│  ├─ crud.js
│  ├─ db.js
│  └─ api.js
├─ scripts/
│  ├─ migrate.js
│  └─ seed.js
├─ .env.example
├─ .gitignore
├─ DEPLOYMENT.md
├─ next.config.mjs
└─ package.json
```

## Environment variables

Required:

- `DATABASE_URL` — PostgreSQL connection string.
- `AUTH_SECRET` — long random signing secret.

Optional:

- `NEXT_PUBLIC_APP_NAME` — UI application name.

## Database architecture

Tables: `users`, `personnel`, `family`, `leaves`, `postings`, `documents`, `awards`, `payments`.

All child modules use foreign keys to `personnel`. The schema is included in `db/schema.sql` and is safe to execute repeatedly because it uses `CREATE ... IF NOT EXISTS` and explicit constraint/index handling.

## Authentication

Passwords are hashed with bcrypt. A signed JWT is stored in an HTTP-only, SameSite cookie. API routes verify the session and role before returning or changing data. Database credentials are never sent to the browser.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL database and `AUTH_SECRET` to a random secret.
3. Install dependencies: `npm install`.
4. Initialize schema: `npm run db:migrate`.
5. Load fictional demo records: `npm run db:seed`.
6. Start: `npm run dev`.
7. Open the shown local URL.

A local PostgreSQL database is optional; a cloud PostgreSQL database can be used during development as well.

## Production deployment

See `DEPLOYMENT.md` for the exact GitHub → managed PostgreSQL → Vercel flow.

## Demo credentials

- Admin: `admin` / `Admin@123`
- Personnel: `personnel01` / `Personnel@123`

Change these demo credentials before any non-academic use.

## ER diagram

The canonical ER diagram is in `db/er-diagram.md` and is generated from the same schema represented by `db/schema.sql`.

## Academic/demo disclaimer

All names, service numbers, contact details, postings, awards, payments and document references in the seed are fictional and intended solely for software demonstration.
