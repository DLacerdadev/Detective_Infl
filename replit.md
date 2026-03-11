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
- **Authentication**: Replit Auth (OpenID Connect / PKCE)
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
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Replit Auth browser hooks
├── scripts/                # Utility scripts
└── ...
```

## Features

### Authentication
- Replit Auth via OpenID Connect (PKCE)
- Cookie-based sessions stored in PostgreSQL
- User roles: `user` (default) and `admin`

### Frontend Pages
- `/` — Landing page with noir investigation aesthetic
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
- `users` — Auth users with role field
- `sessions` — Session storage for Replit Auth
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

- `pnpm --filter @workspace/api-server run dev` — Start API server
- `pnpm --filter @workspace/ordo-realitas run dev` — Start frontend
- `pnpm --filter @workspace/db run push` — Push DB schema changes
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API types
