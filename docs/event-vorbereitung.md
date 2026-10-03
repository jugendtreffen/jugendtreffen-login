# Event-Vorbereitung

Checkliste für ein neues Jugendtreffen. Es gibt noch keine Admin-Oberfläche für Events. Events werden direkt in der Datenbank angelegt (Supabase Table Editor oder SQL).

## Aktuelles Event

Das Anmeldeformular verwendet `currentEvent` (`api/src/services/events/events.ts`): das Event mit dem **spätesten `startDate`, das bereits in der Vergangenheit liegt**.

> Ein Event, dessen Start noch in der Zukunft liegt, wird damit **nicht** als aktuelles Event zurückgegeben. Solange das neue Event noch nicht begonnen hat, zeigt das Formular das vorherige Event.
> TODO: Logik anpassen (z. B. nächstes kommendes oder laufendes Event) oder die gewünschte Vorgehensweise hier beschreiben.

## Vor dem Event

- [ ] **Event anlegen** in der Tabelle `events`:
  - `name` (eindeutig, z. B. „Jugendtreffen 2027“), `desc`
  - `startDate`, `endDate`
  - `pricePerDay`: ohne Wert ist jede Anmeldung kostenlos
  - `earlyBirdCutoff`: letzter Tag mit 10 % Frühbucherrabatt (optional)
- [ ] Prüfen, ob `/register` das richtige Event anzeigt (siehe oben)
- [ ] **Brevo-Template 4** (Anmeldebestätigung) auf Texte, Datum und Preise prüfen
- [ ] **Testanmeldung** durchführen: Preis, Armbandfarbe, Mail und Link zur Zusammenfassung prüfen. Testteilnehmer danach löschen.
- [ ] **Mitarbeiter-Rollen** vergeben (View *Mitarbeiter*): Check-in-Team → `checkin`, Quartier → `quartier_boys` / `quartier_girls`
- [ ] Mitarbeiter bitten, sich nach der Rollenvergabe neu einzuloggen

## Während des Events

- Check-in über die View *Checkin*. Falsche Daten können beim Check-in korrigiert werden.
- Armbandfarben siehe [Datenbank → Armbandfarben](datenbank.md#armbandfarben). Mitarbeiter, Team und Tagesgäste bekommen ihre Farbe manuell.

## Nach dem Event

- [ ] Teilnehmerdaten exportieren, falls benötigt. TODO: Vorgehen und Aufbewahrungsfrist (DSGVO) festlegen.
- [ ] Rollen der Mitarbeiter auf `none` zurücksetzen, wenn sie keinen Zugriff mehr brauchen
