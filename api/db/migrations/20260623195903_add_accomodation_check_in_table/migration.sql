/*
  Warnings:

  - You are about to drop the `presences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "presences" DROP CONSTRAINT "presences_eventId_fkey";

-- DropTable
DROP TABLE "presences";

-- CreateTable
CREATE TABLE "accomodationcheckIn" (
    "id" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "participantId" UUID NOT NULL,
    "eventId" BIGINT NOT NULL,

    CONSTRAINT "accomodationcheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accomodationcheckIn_participantId_idx" ON "accomodationcheckIn"("participantId");

-- AddForeignKey
ALTER TABLE "accomodationcheckIn" ADD CONSTRAINT "accomodationcheckIn_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
