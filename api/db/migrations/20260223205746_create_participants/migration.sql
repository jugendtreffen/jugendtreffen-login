/*
  Warnings:

  - You are about to drop the `participations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personalDatas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_eventId_fkey";

-- AlterTable
ALTER TABLE "events"
  ALTER COLUMN "desc" DROP NOT NULL,
ALTER
COLUMN "startDate" SET DATA TYPE DATE,
ALTER
COLUMN "endDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "presences"
  ALTER COLUMN "date" SET DATA TYPE DATE;

-- DropTable
DROP TABLE "participations";

-- DropTable
DROP TABLE "personalDatas";

-- CreateTable
CREATE TABLE "participants"
(
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneCaretakerContact" TEXT,
    "foundUsBy" TEXT,
    "isParent" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "travelMethod" TEXT,
    "accommodation" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate"   DATE NOT NULL,
    "foodChoice" TEXT NOT NULL,
    "acceptPhotos" BOOLEAN NOT NULL,
    "acceptCoC" BOOLEAN NOT NULL,
    "eventId" BIGINT NOT NULL,
    "participationRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "participants"
  ADD CONSTRAINT "participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
