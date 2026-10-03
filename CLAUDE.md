# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Registration and on-site management app for the "Jugendtreffen Kremsmünster" youth event. RedwoodJS 8.9 monorepo (Yarn workspaces `api` + `web`), Prisma on Supabase Postgres, Supabase Auth, Tailwind + shadcn/ui, deployed to Vercel. User-facing strings and error messages are in German.

## Commands

```bash
yarn install
yarn rw dev                      # web :8910, api :8911 (GraphQL at /.redwood/functions/graphql)
yarn rw lint                     # ESLint (@redwoodjs/eslint-config) + prettier
yarn rw type-check
yarn rw g types                  # regenerate GraphQL/Prisma types after SDL or schema changes

# Tests
yarn test:services               # starts a local Postgres container (scripts/run-test-db.sh), loads .env.test, runs api services once
yarn test:services:watch
yarn rw test api src/services/participants --watch=false   # single file/dir (needs DB + .env.test loaded)
yarn rw test web --watch=false   # web side

# Database
yarn rw prisma migrate dev       # create/apply migration
yarn format-db                   # prisma format + validate
yarn rw prisma db push
```

Running a single api test manually: `bash scripts/run-test-db.sh && set -a && . ./.env.test && set +a && yarn rw test api <path> --watch=false --runInBand`. `run-test-db.sh` starts a `postgres:16-alpine` container named `redwood-postgres` on port 5432 via podman or docker (skipped if 5432 is already open). `.env.test` contains dummy Supabase/Brevo values so services can be imported.

Formatting: no semicolons, single quotes, `es5` trailing commas, imports auto-organized (`prettier-plugin-organize-imports`).

## Architecture

**API (`api/src`)** — standard Redwood: SDLs in `graphql/*.sdl.ts`, resolvers in `services/<name>/<name>.ts` with `*.scenarios.ts` fixtures and `*.test.ts`. Services: `events`, `participants`, `presences`, `staff`, `mailer`.

- `lib/db.ts` — Prisma client. Datasource uses `SUPABASE_TRANSACTION_POOLER_URL` (url) and `SUPABASE_SESSION_POOLER_URL` (directUrl).
- `lib/supabase.ts` — server-side Supabase admin client (needs `SUPABASE_SECRET_KEY`); used by `staff` service to list users via `auth.admin`.
- `lib/brevoMailer.ts` + `services/mailer` — transactional email through Brevo templates (registration confirmation links to `/register-success/{participantId}`).
- `lib/bigIntPolyfill.ts` — `Event.id`/`Presence.id` are `BigInt`; this makes them serializable.

**Auth & roles** — Supabase Auth. Roles live in the Prisma `UserRole` table (`user_roles`, one row per user, enum `UserRoleEnum`: admin, checkin, quartier_boys, quartier_girls, none). The migration `20260502070949_add_role_handling` defines a Postgres `custom_access_token_hook` that injects `user_role` into the JWT, and a `handle_new_user` trigger that inserts role `none` for new users. The hook and the trigger on `auth.users` must be enabled manually in Supabase (Prisma can't touch the `auth` schema). `lib/auth.ts#getCurrentUser` maps `decoded.user_role` → `currentUser.roles`; services enforce with `requireAuth({ roles: [...] })`.

**Data model** (`api/db/schema.prisma`) — `Event` (with `pricePerDay`, `earlyBirdCutoff`) has many `Participant` and `Presence`. Participants are anonymous registrations (not linked to auth users); `createParticipant` computes `price` via `calculateParticipantPrice` (stay days × `pricePerDay`) and sends the confirmation mail. `currentEvent` query drives the registration form.

**Web (`web/src`)** — `@/*` alias maps to `src/*`. Routes (`Routes.tsx`) are few: `/` (HomePage), `/login`, `/signup`, `/verify`, `/register`, `/register-success/{id}`. The authenticated app lives entirely inside `HomePage`: when logged in it renders `SidebarLayout` + `views/ViewRouter.tsx`, which switches on the selected sidebar item (Dashboard, Quartier, Checkin, Join the Team, Mitarbeiter) rather than using URL routes. Add new staff screens as views there. `roles.tsx` provides `useRole()` for role-dependent UI. UI primitives: `components/ui` (shadcn, add via `yarn dlx shadcn@latest add`), `components/animate-ui`, data tables in `components/ui/data-table` + `hooks/use-data-table.ts`. Flowbite blocks are the preferred source for page templates.

## Workflow notes

- PRs target the `staging` branch (see `.github/pull_request_template.md`); schema changes must ship with a migration.
- Production: `yarn build:prod` deploys to Vercel and `yarn migrate:prod` runs `prisma migrate deploy`, both using `.env.production`.
