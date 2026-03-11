# Ordo Realitas — RPG Character Manager

## Overview

Full-stack web application for managing characters in the **Ordem Paranormal** tabletop RPG system. Features a dark noir investigation aesthetic (1980s detective office), with real-time character management, admin tools, and planned virtual table support.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifact: `ordo-realitas`, preview path: `/`)
- **API framework**: Express 5 (artifact: `api-server`, path: `/api`)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Custom email/password (bcrypt) + Google Sign-In (`google-auth-library`)
- **Sessions**: Cookie-based sessions stored in PostgreSQL (`express-session` + `connect-pg-simple`)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **UI**: Tailwind CSS + Radix UI + shadcn components
- **Animations**: Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── ordo-realitas/      # React frontend (landing, characters, admin)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── docker/
│   ├── nginx.conf          # nginx reverse proxy config for frontend container
│   └── entrypoint.sh       # API container startup (migrate + seed + run)
├── Dockerfile.api          # Multi-stage API build (esbuild → node)
├── Dockerfile.frontend     # Multi-stage frontend build (Vite → nginx)
├── docker-compose.yml      # Production Docker Compose (postgres + api + frontend)
├── docker-compose.example.env  # Template for .env file
├── .dockerignore
└── scripts/                # Utility scripts
```

## Features

### Authentication
- **Email/password**: bcrypt (12 rounds), session-based
- **Google Sign-In**: ID token verification via `google-auth-library`, auto-creates user on first login
- Sessions stored in PostgreSQL via `connect-pg-simple`
- User roles: `user` (default) and `admin`
- `GOOGLE_CLIENT_ID` env var gates the Google button on the login page

### Frontend Pages
- `/` — Landing page with noir investigation aesthetic
- `/login` — Email/password + Google Sign-In
- `/characters` — Character list (protected), shows all characters for logged-in user
- `/characters/new` — Multi-step character creation wizard (protected)
- `/characters/:id` — Full character sheet view with tabs (protected)
- `/admin` — Admin panel for managing game data (admin only)

### Admin Panel
Manages all static game data:
- Classes (Combatente, Especialista, Ocultista)
- Origens (character backgrounds)
- Perícias (skills/abilities)
- Rituais (paranormal rituals)
- Itens (equipment/items)
- User role management

### Database Schema
- `users` — Auth users (`password_hash`, `google_id`, `role`)
- `sessions` — Session storage
- `personagens` — Character sheets
- `classes` — RPG classes
- `origens` — Character origins/backgrounds
- `pericias` — Skills
- `rituais` — Paranormal rituals
- `itens` — Equipment and items

### Game System (Ordem Paranormal)
- **Attributes**: Forca, Agilidade, Intelecto, Vigor, Presença (1-5)
- **Resources**: PV (hit points), PE (effort points), Sanidade (sanity)
- **NEX**: 0-99% paranormal exposure level
- **Nível**: 1-20 mundane proficiency
- **Patentes**: Recruta, Operador, Agente Especial, Agente de Elite
- **Ritual Elements**: Sangue, Morte, Conhecimento, Energia, Medo

## Visual Identity

Dark noir investigation room aesthetic:
- Dark brown/wood tones background
- Blood red accents and highlights
- Typewriter-style fonts
- Polaroid photo card style for characters
- Dossier/file folder visual metaphors

## Future Features (In Scope)
- Virtual tables (mesas virtuais) for group play
- Real-time dice rolling
- Session management for GMs

## Development Commands

```bash
pnpm --filter @workspace/api-server run dev   # Start API server
pnpm --filter @workspace/ordo-realitas run dev # Start frontend
pnpm --filter @workspace/db run push          # Push DB schema changes
pnpm --filter @workspace/db run seed          # Seed initial game data
pnpm --filter @workspace/api-spec run codegen # Regenerate API types
```

## Docker Deployment (Self-Hosted VM)

### Prerequisites
- Docker + Docker Compose plugin
- Port 80 open on the VM

### Setup

```bash
# 1. Clone the repo on the VM
git clone <repo-url> ordo-realitas
cd ordo-realitas

# 2. Create the .env file
cp docker-compose.example.env .env
# Edit .env and set POSTGRES_PASSWORD and optionally GOOGLE_CLIENT_ID

# 3. Build and start
docker compose up -d --build

# 4. View logs
docker compose logs -f
```

### Services
| Service    | Image          | Role                                 |
|------------|----------------|--------------------------------------|
| `postgres` | postgres:16    | Database                             |
| `api`      | Dockerfile.api | Express API (migrations + seed auto) |
| `frontend` | Dockerfile.frontend | Nginx serving React build + proxy |

### Environment Variables (`.env`)
| Variable           | Required | Description                              |
|--------------------|----------|------------------------------------------|
| `POSTGRES_PASSWORD`| Yes      | PostgreSQL password                      |
| `GOOGLE_CLIENT_ID` | No       | Enables Google Sign-In button on login   |

### How it Works
1. `postgres` starts and waits for healthcheck
2. `api` container starts → `entrypoint.sh` runs:
   - `drizzle-kit push --force` (applies schema)
   - `tsx src/seed.ts` (seeds game data if tables are empty)
   - `node artifacts/api-server/dist/index.cjs` (starts Express)
3. `frontend` (nginx) starts and proxies `/api/` to `api:8080`
