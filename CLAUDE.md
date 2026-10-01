# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Registration and staff app for the "Jugendtreffen Kremsmünster" event. RedwoodJS 8.9 monorepo (Yarn workspaces `api` + `web`), Supabase for auth and Postgres, Prisma ORM, Brevo for transactional email, deployed to Vercel. UI text, error messages and most comments are in **German** — keep new user-facing strings in German.

## Commands

```bash
yarn install
yarn rw dev                      # web on :8910, api/GraphQL on :8911
yarn rw test                     # all Jest tests (root `yarn test` adds --watchAll)
yarn rw test web                 # only web side (or: yarn rw test api)
yarn rw test web ParticipantDetailForm   # single test file by name pattern
yarn rw lint                     # ESLint (eslint.config.mts); add --fix to autofix
yarn rw type-check
yarn rw build
yarn rw generate types           # regenerate types/graphql after SDL/query changes
yarn format-db                   # prisma format + validate
yarn rw prisma migrate dev       # create/apply migration (see DB caveats below)
yarn rw exec seed                # scripts/seed.ts
```

`package.json` requires Node 24.x (README still says 20.x — trust `engines`). Env vars: see `.env.defaults`; additionally the api needs `SUPABASE_SECRET_KEY` and `BREVO_API_KEY` (both throw at import if missing). Only `SUPABASE_URL` and `SUPABASE_ANON_KEY` are exposed to the web side (`redwood.toml`).

Add shadcn UI components with `yarn dlx shadcn@latest add <component>` (lands in `web/src/components/ui`).

## Architecture

### API (`api/src`)
- Standard Redwood layout: `graphql/*.sdl.ts` (schema + `@requireAuth`/`@skipAuth` directives) → `services/<name>/<name>.ts` resolvers using `db` (Prisma) from `src/lib/db`. Service tests use `*.scenarios.ts` fixtures.
- Public (`@skipAuth`) operations: event queries (`currentEvent` etc.), `participant(id)` and `createParticipant` — the event registration form is used anonymously. Everything else requires auth.
- **Roles**: SDL directives only check "logged in"; role checks happen inside services via `requireAuth({ roles: [...] })` from `src/lib/auth`. `getCurrentUser` reads the role from the JWT claim `user_role`, which is injected by a Supabase **custom access token hook** (`public.custom_access_token_hook`, defined in migration `20260502070949_add_role_handling`) reading the `user_roles` table. Role values come from `UserRoleEnum` in `schema.prisma`. The hook and the `on_auth_user_created` trigger (assigns role `none`) must be configured manually in Supabase — Prisma can't touch the `auth` schema. A role change only takes effect after the user's token is refreshed.
- `src/lib/supabase.ts` is a service-role Supabase admin client (used e.g. by `staff` service to list `auth.users`). `src/lib/brevoMailer.ts` + `services/mailer` send emails; templates live in `api/src/emails` (React components).

### Database caveats
- Prisma connects through Supabase poolers: `SUPABASE_TRANSACTION_POOLER_URL` (runtime) and `SUPABASE_SESSION_POOLER_URL` (`directUrl`, migrations).
- Foreign keys to `auth.users` are maintained by hand-written SQL outside Prisma's knowledge. Per README, run `yarn rw prisma db execute --file=./api/db/pre_migration.sql` before and `--file=./api/db/add_personalDatas_users_fkey.sql` after migrating, or migrations fail.
- PRs that change the schema must include a migration (PR template checklist).

### Web (`web/src`)
- Imports use both `src/...` and the `@/...` alias (both map to `web/src`).
- Provider stack in `App.tsx`: Supabase `AuthProvider` → `RedwoodApolloProvider` → `RoleProvider` (`roles.tsx`, currently a stub returning a hardcoded role — the real role comes from `useAuth().currentUser.roles`).
- Routing (`Routes.tsx`) is minimal. The logged-in app is a single-page dashboard at `/`: `HomePage` shows `LandingPageView` when anonymous, otherwise `SidebarLayout` + `pages/HomePage/views/ViewRouter.tsx`. Sidebar entries are chosen per role in `SidebarLayout.getSidebarItemsByRole`, the active entry is persisted in `localStorage`, and `ViewRouter`'s `viewMap` maps the `SidebarItem` name to a view component. To add a dashboard section: extend the `SidebarItem` type, add it in `getSidebarItemsByRole`, and register it in `viewMap`.
- Data fetching uses Redwood Cells (`*Cell.tsx` with `.mock.ts`/`.test.tsx`). `hooks/CurrenteventHook.tsx` provides the current event via context.
- Forms: react-hook-form + zod schemas (`*Schema.ts` next to the form). Tables: TanStack Table wrapper in `components/ui/data-table` with `hooks/use-data-table.ts` (URL state via `nuqs`). Styling: Tailwind v4 + shadcn/Radix; `components/animate-ui` holds animated primitives.
- Web tests run with `web/src/test/supabaseMock.ts`, which globally mocks `@supabase/supabase-js`.

## Conventions

- Prettier: no semicolons, single quotes, trailing commas `es5`, organize-imports plugin.
- PRs target the `staging` branch, not `main` (see `.github/pull_request_template.md`).
