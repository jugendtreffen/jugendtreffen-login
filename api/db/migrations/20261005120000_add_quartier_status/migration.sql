-- CreateEnum
CREATE TYPE "QuartierStatusEnum" AS ENUM ('present', 'absent', 'excused', 'sick');

-- CreateTable
CREATE TABLE "quartier_status" (
    "id" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "status" "QuartierStatusEnum" NOT NULL,
    "participantId" UUID NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quartier_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quartier_status_participantId_date_key" ON "quartier_status"("participantId", "date");

-- AddForeignKey
ALTER TABLE "quartier_status" ADD CONSTRAINT "quartier_status_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
