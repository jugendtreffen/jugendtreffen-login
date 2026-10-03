# API

Eine GraphQL-API unter `/.redwood/functions/graphql` (lokal `http://localhost:8911/graphql`). SDLs in `api/src/graphql`, Resolver in `api/src/services`.

## Operationen

Legende Auth: **öffentlich** = `@skipAuth`; **Login** = `@requireAuth`, jede Rolle; **admin** = zusätzlich `requireAuth({ roles: ['admin'] })` im Service.

### Queries

| Query | Auth | Zweck | Verwendet von |
| --- | --- | --- | --- |
| `events` | öffentlich | alle Events | – |
| `event(id)` | öffentlich | ein Event | – |
| `currentEvent` | öffentlich | Event für die Anmeldung, siehe [Event-Vorbereitung](event-vorbereitung.md#aktuelles-event) | `CurrentEventCell`, `CurrenteventHook` |
| `participant(id)` | öffentlich | ein Teilnehmer | `RegistrationOverviewCell`, `CheckinDetails` |
| `participants` | Login | alle Teilnehmer (aller Events) | `ParticipantsTableCell`, `DashboardView` |
| `presences` | Login | alle Anwesenheiten | – |
| `staffUsers` | admin | alle Auth-User außer dem eigenen, mit Rolle | `StaffCell` |

### Mutations

| Mutation | Auth | Zweck | Verwendet von |
| --- | --- | --- | --- |
| `createParticipant(input)` | öffentlich | Anmeldung: Preis + Armbandfarbe berechnen, speichern, Mail senden | `EventRegistrationForm` |
| `updateParticipant(id, input)` | Login | Daten ändern, Check-in (`checkinConfirmed`) | `ParticipantDetailForm` |
| `deleteParticipant(id)` | Login | Teilnehmer löschen | – |
| `checkinParticipant(id)` | Login | **kein Resolver vorhanden** | – |
| `createPresence` / `updatePresence` / `deletePresence` | Login | Anwesenheit verwalten | – |
| `updateStaffRole(input)` | admin | Rolle eines Users setzen (`null` → `none`) | `StaffCell` |

Die genauen Felder stehen in den SDL-Dateien. Nach Änderungen an einem SDL `yarn rw g types` ausführen.

## Playground

Bei laufendem `yarn rw dev` ist der GraphQL-Playground unter `http://localhost:8911/graphql` erreichbar. Für geschützte Operationen diese Header setzen:

```json
{ "auth-provider": "supabase", "Authorization": "Bearer <token>" }
```

Den Token bekommt man aus einer laufenden Session, z. B. mit `getToken()` aus `useAuth()` in der Browser-Konsole ausgeben.
