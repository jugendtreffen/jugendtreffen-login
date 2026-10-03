# Betrieb

## Umgebungen

| Umgebung | Branch | Hosting | Datenbank / Auth |
| --- | --- | --- | --- |
| Lokal | beliebig | `yarn rw dev` | eigenes Supabase-Projekt bzw. lokale Postgres für Tests |
| Staging | `staging` | TODO: Vercel-Projekt/URL | TODO: Supabase-Projekt |
| Produktion | `main` | Vercel, `https://login.jugendtreffen.at` | TODO: Supabase-Projekt |

## Umgebungsvariablen

| Variable | Seite | Zweck |
| --- | --- | --- |
| `SUPABASE_URL` | api + web | URL des Supabase-Projekts |
| `SUPABASE_ANON_KEY` | web | öffentlicher Key für den Browser-Client |
| `SUPABASE_SECRET_KEY` | api | Service-Key für `auth.admin` (Mitarbeiterliste). **Geheim** |
| `SUPABASE_JWT_SECRET` | api | prüft die JWTs der Requests |
| `SUPABASE_TRANSACTION_POOLER_URL` | api | Prisma-Verbindung zur Laufzeit (Pooler, Port 6543) |
| `SUPABASE_SESSION_POOLER_URL` | api | Prisma `directUrl` für Migrationen |
| `BREVO_API_KEY` | api | E-Mail-Versand. **Geheim** |
| `BREVO_API_BASE_URL` | api | optional, Standard `https://api.brevo.com/v3` |
| `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` | api | optional, Absender der Mails |
| `LOG_LEVEL` | api | optional, `trace` bis `silent` |
| `API_URL` | web | optional, überschreibt den API-Pfad (`redwood.toml`) |

Fehlen `SUPABASE_URL`, `SUPABASE_SECRET_KEY` oder `BREVO_API_KEY`, bricht die API beim Start ab.

Lokal stehen die Werte in `.env`, für Produktion in `.env.production` (beide nicht eingecheckt). Auf Vercel werden sie in den Projekteinstellungen gesetzt.

## Deployment

1. **Migration** auf die Produktionsdatenbank anwenden:
   ```bash
   yarn migrate:prod        # prisma migrate deploy mit .env.production
   ```
2. **Deploy** nach Vercel:
   ```bash
   yarn build:prod          # rw deploy vercel mit .env.production
   ```

Erst migrieren, dann deployen. Sonst läuft neuer Code gegen das alte Schema.

TODO: Deployt Vercel bei Push auf `main`/`staging` automatisch, oder nur manuell über `build:prod`?

## Supabase einrichten

Einmalig pro neuem Supabase-Projekt, nachdem die Migrationen gelaufen sind:

1. **Access-Token-Hook aktivieren:** Authentication → Hooks → *Customize Access Token (JWT) Claims* → Postgres-Funktion `public.custom_access_token_hook`.
2. **Trigger für neue User anlegen** (SQL-Editor):
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
   ```
3. **Redirect-URLs** unter Authentication → URL Configuration eintragen (Site-URL und `/verify`).
4. **E-Mail-Templates** für die Signup-Bestätigung anpassen. TODO: aktuelle Einstellungen dokumentieren.

### Ersten Admin anlegen

Account normal über `/signup` anlegen und bestätigen, dann im SQL-Editor:

```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE "userId" = (SELECT id FROM auth.users WHERE email = '<email>');
```

Danach neu einloggen. Weitere Rollen vergibt der Admin in der App.

## Brevo (E-Mail)

- Mails werden über die Brevo-API mit Templates verschickt (`api/src/lib/brevoMailer.ts`, `api/src/services/mailer/mailer.ts`).
- Absender: `anmeldung@jugendtreffen.at`. Die Domain muss in Brevo verifiziert sein.

| Template-ID | Verwendung | Parameter |
| --- | --- | --- |
| `4` | Bestätigung der Anmeldung | `summary_url` → `https://login.jugendtreffen.at/register-success/{id}` |

Schlägt der Mailversand fehl, bekommt der Teilnehmer einen Fehler angezeigt, obwohl der Teilnehmer bereits in der Datenbank gespeichert ist.

## Monitoring

- Vercel Analytics und Speed Insights sind in `web/src/App.tsx` eingebunden.
- API-Logs (pino) in den Vercel-Function-Logs. Registrierungen und Änderungen an Teilnehmern werden mit E-Mail des Bearbeiters geloggt.

## Troubleshooting

| Problem | Ursache / Lösung |
| --- | --- |
| Neue Rolle wird nicht übernommen | Rolle steht im JWT. Neu einloggen. Prüfen, ob der Access-Token-Hook aktiv ist. |
| Neuer User hat keine Rolle / `updateStaffRole` schlägt fehl | Trigger `on_auth_user_created` fehlt. Anlegen und Eintrag in `user_roles` nachtragen. |
| API startet nicht: „… ist nicht gesetzt“ | Umgebungsvariable fehlt, siehe Tabelle oben. |
| Registrierung meldet Fehler, Teilnehmer existiert trotzdem | Brevo-Versand fehlgeschlagen (API-Key, Template-ID, Absender-Domain). |
| Anmeldeformular zeigt falsches/kein Event | Siehe [Event-Vorbereitung](event-vorbereitung.md#aktuelles-event). |
| Migration schlägt fehl | `SUPABASE_SESSION_POOLER_URL` (directUrl) prüfen. Migrationen laufen nicht über den Transaction-Pooler. |
