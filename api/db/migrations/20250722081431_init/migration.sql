-- CreateTable
CREATE TABLE "personalDatas" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" TEXT,
    "phoneNumber"           TEXT,
    "phoneCaretakerContact" TEXT,
    "foundUsBy"             TEXT,
    "isParent"              BOOLEAN,
    "roleId" INTEGER NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "address" TEXT,
    "userId"                UUID NOT NULL,

    CONSTRAINT "personalDatas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" BIGSERIAL NOT NULL,
    "travelMethod" TEXT,
    "participationRoleId" INTEGER,
    "accommodation" BOOLEAN,
    "accomodationLocation" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "foodChoice"           TEXT    NOT NULL,
    "helpAfterwards" BOOLEAN,
    "acceptPhotos" BOOLEAN NOT NULL,
    "acceptCoC" BOOLEAN NOT NULL,
    "eventId"              INTEGER NOT NULL,
    "userId"               UUID    NOT NULL,

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
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personalDatas_userId_key" ON "personalDatas"("userId");

-- CreateIndex
CREATE INDEX "participations_userId_idx" ON "participations" ("userId");

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
