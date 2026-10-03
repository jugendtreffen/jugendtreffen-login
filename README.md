# Jugendtreffen Login

Anmelde- und Verwaltungs-App für das Jugendtreffen Kremsmünster. Teilnehmer melden sich ohne Account über ein Formular an und bekommen eine Bestätigungsmail. Mitarbeiter loggen sich ein und machen je nach Rolle Check-in, Quartierverwaltung oder Mitarbeiterverwaltung.

**Tech-Stack:** [RedwoodJS](https://redwoodjs.com/docs) 8 (React + GraphQL), Prisma, Supabase (Postgres + Auth), Tailwind + shadcn/ui, Brevo (E-Mail), Vercel.

## Quickstart

Voraussetzungen: Node.js 24.x, Yarn, Podman oder Docker (für Tests).

```bash
yarn install
cp .env.defaults .env      # Werte eintragen
yarn rw prisma migrate dev
yarn rw dev                # http://localhost:8910
```

Tests: `yarn test:services`

## Dokumentation

Die ausführliche Doku liegt in [`docs/`](docs/README.md):

- [Entwicklung](docs/entwicklung.md): Setup, Befehle, Tests, Konventionen
- [Architektur](docs/architektur.md): Aufbau und Abläufe
- [Datenbank](docs/datenbank.md): Datenmodell, Preisberechnung, Migrationen
- [Auth und Rollen](docs/auth-und-rollen.md): Login, Rollen, Berechtigungen
- [API](docs/api.md): GraphQL-Operationen
- [Betrieb](docs/betrieb.md): Deployment, Umgebungsvariablen, Supabase, Brevo
- [Event-Vorbereitung](docs/event-vorbereitung.md): Checkliste für ein neues Jugendtreffen

Für Redwood-Konzepte (Cells, Services, Directives) siehe die [Redwood-Doku](https://redwoodjs.com/docs).
