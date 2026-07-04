/*
  Warnings:

  - A unique constraint covering the columns `[participantId,date]` on the table `accomodationcheckIn` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accomodationcheckIn_participantId_date_idx";

-- CreateIndex
CREATE UNIQUE INDEX "accomodationcheckIn_participantId_date_key" ON "accomodationcheckIn"("participantId", "date");
