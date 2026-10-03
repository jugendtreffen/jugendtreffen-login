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

**Auth & roles** — Supabase Auth. One role per user in `user_roles` (Prisma `UserRole`); a Postgres `custom_access_token_hook` puts it into the JWT as `user_role`, `lib/auth.ts#getCurrentUser` maps it to `currentUser.roles`, services enforce with `requireAuth({ roles: [...] })`. Details, role table and known gaps: `docs/auth-und-rollen.md`.

**Data model** (`api/db/schema.prisma`) — `Event` has many `Participant` and `Presence`. Participants are anonymous registrations (no auth user). `createParticipant` derives `bandColour` from age and `price` via `calculateParticipantPrice`, then sends the Brevo confirmation mail. Details: `docs/datenbank.md`.

**Web (`web/src`)** — `@/*` alias maps to `src/*`. Routes (`Routes.tsx`) are few: `/` (HomePage), `/login`, `/signup`, `/verify`, `/register`, `/register-success/{id}`. The authenticated app lives entirely inside `HomePage`: when logged in it renders `SidebarLayout` + `views/ViewRouter.tsx`, which switches on the selected sidebar item (Dashboard, Quartier, Checkin, Join the Team, Mitarbeiter) rather than using URL routes. Add new staff screens as views there and unlock them per role in `getSidebarItemsByRole` (`SidebarLayout.tsx`). UI primitives: `components/ui` (shadcn, add via `yarn dlx shadcn@latest add`), `components/animate-ui`, data tables in `components/ui/data-table` + `hooks/use-data-table.ts`. Flowbite blocks are the preferred source for page templates.

## Workflow notes

- Project documentation lives in `docs/` (German). When a change affects behavior described there (roles, data model, API operations, env vars, deployment), update the matching file in the same change.

- PRs target the `staging` branch (see `.github/pull_request_template.md`); schema changes must ship with a migration.
- Production: `yarn build:prod` deploys to Vercel and `yarn migrate:prod` runs `prisma migrate deploy`, both using `.env.production`.
