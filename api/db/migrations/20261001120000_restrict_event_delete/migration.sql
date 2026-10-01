-- eventId ist NOT NULL, ON DELETE SET NULL konnte daher nie funktionieren.
-- RESTRICT verhindert das Löschen eines Events, solange noch Anmeldungen/Anwesenheiten existieren.

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_eventId_fkey";

-- DropForeignKey
ALTER TABLE "presences" DROP CONSTRAINT "presences_eventId_fkey";

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presences" ADD CONSTRAINT "presences_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
