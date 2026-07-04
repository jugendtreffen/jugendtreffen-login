-- DropIndex
DROP INDEX "accomodationcheckIn_participantId_idx";

-- CreateIndex
CREATE INDEX "accomodationcheckIn_participantId_date_idx" ON "accomodationcheckIn"("participantId", "date");
