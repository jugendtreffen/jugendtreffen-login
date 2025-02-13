/*
  Warnings:

  - Added the required column `endDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodChoice` to the `participations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "participations" ADD COLUMN     "foodChoice" TEXT NOT NULL;
