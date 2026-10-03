# Entwicklung

## Voraussetzungen

- Node.js 24.x und Yarn
- Podman oder Docker (für die Service-Tests)
- Zugang zu einem Supabase-Projekt für die lokale Entwicklung

## Setup

```bash
yarn install
cp .env.defaults .env      # Werte eintragen, siehe Betrieb → Umgebungsvariablen
yarn rw prisma migrate dev # Schema auf die Entwicklungsdatenbank anwenden
yarn rw dev                # Web: http://localhost:8910, API: http://localhost:8911
```

`.env.defaults` enthält nicht alle benötigten Variablen. Zusätzlich braucht die API `SUPABASE_SECRET_KEY` und `BREVO_API_KEY`, siehe [Betrieb](betrieb.md#umgebungsvariablen). Ein neues Supabase-Projekt muss außerdem einmalig [eingerichtet](betrieb.md#supabase-einrichten) werden.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `yarn rw dev` | Entwicklungsserver |
| `yarn rw lint` | ESLint + Prettier (`--fix` zum Korrigieren) |
| `yarn rw type-check` | TypeScript prüfen |
| `yarn rw g types` | GraphQL- und Prisma-Typen neu generieren |
| `yarn format-db` | `schema.prisma` formatieren und validieren |
| `yarn rw storybook` | Storybook |
| `yarn dlx shadcn@latest add` | shadcn-Komponente hinzufügen |

## Tests

Die API-Service-Tests laufen gegen eine lokale Postgres im Container:

```bash
yarn test:services          # einmal
yarn test:services:watch    # Watch-Modus
```

Dabei passiert:
1. `scripts/run-test-db.sh` startet `postgres:16-alpine` als Container `redwood-postgres` auf Port 5432 (Podman, sonst Docker). Läuft auf 5432 schon etwas, wird es verwendet.
2. `.env.test` wird geladen: lokale DB-URLs und Dummy-Werte für Supabase und Brevo.
3. Jest läuft über `api/src/services`.

Einzelnen Test ausführen:

```bash
bash scripts/run-test-db.sh && set -a && . ./.env.test && set +a \
  && yarn rw test api src/services/participants --watch=false --runInBand
```

Testdaten stehen in `*.scenarios.ts` neben dem Service ([Redwood Scenarios](https://redwoodjs.com/docs/testing#scenarios)). Externe Dienste (Brevo, Supabase-Admin) werden in den Tests gemockt.

Web-Tests: `yarn rw test web --watch=false`.

## Konventionen

- **Prettier:** keine Semikolons, einfache Anführungszeichen, Trailing Commas (`es5`), Imports werden automatisch sortiert.
- **Imports im Web:** `@/…` zeigt auf `web/src/…`.
- **Sprache:** UI-Texte und Fehlermeldungen an User auf Deutsch, Code und Bezeichner auf Englisch.
- **Berechtigungen:** jede neue Operation im SDL mit `@requireAuth` oder `@skipAuth`; Rollenprüfung im Service mit `requireAuth({ roles })`, siehe [Auth und Rollen](auth-und-rollen.md).
- **UI:** shadcn/ui-Komponenten und Tailwind. Für Seitenlayouts zuerst bei [Flowbite](https://flowbite.com/) nach fertigen Blöcken suchen.

## Git-Workflow

- Feature-Branches (`feature/…`, `fix/…`) → PR auf **`staging`** → nach dem Test Merge nach `main`.
- PR-Checkliste (`.github/pull_request_template.md`): Ziel-Branch `staging`, Migration bei Schemaänderungen, Doku aktualisiert.
