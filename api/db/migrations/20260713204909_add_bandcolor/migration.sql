/*
  Warnings:

  - The values [red,orange,green,blue,white] on the enum `BandColourEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isParent` on the `participants` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BandColourEnum_new" AS ENUM ('red_mitarbeiter', 'white_team', 'yellow_tagesgaeste', 'blue_ue18', 'dark_green_ue16', 'lime_ue14');
ALTER TABLE "participants" ALTER COLUMN "bandColour" TYPE "BandColourEnum_new" USING ("bandColour"::text::"BandColourEnum_new");
ALTER TYPE "BandColourEnum" RENAME TO "BandColourEnum_old";
ALTER TYPE "BandColourEnum_new" RENAME TO "BandColourEnum";
DROP TYPE "BandColourEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "isParent";
