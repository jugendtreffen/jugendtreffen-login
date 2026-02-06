/*
  Warnings:

  - You are about to drop the `participations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personalDatas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_eventId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "desc" DROP NOT NULL;

-- DropTable
DROP TABLE "participations";

-- DropTable
DROP TABLE "personalDatas";

-- CreateTable
CREATE TABLE "registeredParticipants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
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
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "foodChoice" TEXT NOT NULL,
    "acceptPhotos" BOOLEAN NOT NULL,
    "acceptCoC" BOOLEAN NOT NULL,
    "eventId" BIGINT NOT NULL,
    "participationRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registeredParticipants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "registeredParticipants" ADD CONSTRAINT "registeredParticipants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
