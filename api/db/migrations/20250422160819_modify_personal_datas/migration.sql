/*
  Warnings:

  - You are about to drop the column `foundUsBy` on the `participations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "participations" DROP COLUMN "foundUsBy";

-- AlterTable
ALTER TABLE "personalDatas" ADD COLUMN     "foundUsBy" TEXT,
ADD COLUMN     "isParent" BOOLEAN;
