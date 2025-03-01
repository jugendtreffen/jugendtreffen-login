/*
  Warnings:

  - You are about to drop the `Participation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipationRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_participationRoleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropTable
DROP TABLE "Participation";

-- DropTable
DROP TABLE "ParticipationRole";

-- DropTable
DROP TABLE "SystemRole";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "personalDatas" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" TEXT,
    "roleId" INTEGER NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "phoneCaretakerContact" TEXT,
    "userId" UUID,

    CONSTRAINT "personalDatas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" BIGSERIAL NOT NULL,
    "travelMethod" TEXT,
    "participationRoleId" INTEGER,
    "accommodation" BOOLEAN,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "helpAfterwards" BOOLEAN,
    "foundUsBy" TEXT,
    "acceptPhotos" BOOLEAN NOT NULL,
    "acceptCoC" BOOLEAN NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "systemRoles" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "systemRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participationRoles" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "participationRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personalDatas_userId_key" ON "personalDatas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "systemRoles_desc_key" ON "systemRoles"("desc");

-- CreateIndex
CREATE UNIQUE INDEX "participationRoles_desc_key" ON "participationRoles"("desc");

-- CreateIndex
CREATE UNIQUE INDEX "events_name_key" ON "events"("name");

-- AddForeignKey
ALTER TABLE "personalDatas" ADD CONSTRAINT "personalDatas_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "systemRoles"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_participationRoleId_fkey" FOREIGN KEY ("participationRoleId") REFERENCES "participationRoles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey connecting auth.users with personalData (check umgeht die Shaddow Db)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
  ALTER TABLE public."personalDatas"
  ADD CONSTRAINT "personalDatas_users_fkey" FOREIGN KEY ("userId")
    REFERENCES auth.users(id);
END IF;
END $$;
