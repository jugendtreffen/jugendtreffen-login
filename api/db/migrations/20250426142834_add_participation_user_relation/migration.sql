/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `participations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "participations"
  ADD COLUMN "userId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "participations_userId_key" ON "participations" ("userId");
