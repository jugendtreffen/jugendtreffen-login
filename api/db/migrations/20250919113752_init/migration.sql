-- CreateTable
CREATE TABLE "personalDatas" (
                               "id"          UUID         NOT NULL,
    "name" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" TEXT,
                               "phoneNumber" TEXT,
    "phoneCaretakerContact" TEXT,
                               "foundUsBy"   TEXT,
                               "isParent"    BOOLEAN,
    "country" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "address" TEXT,
                               "userId"      UUID         NOT NULL,
                               "role"        TEXT         NOT NULL,
                               "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personalDatas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" BIGSERIAL NOT NULL,
    "travelMethod" TEXT,
    "accommodation" BOOLEAN,
    "accomodationLocation" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "foodChoice"        TEXT   NOT NULL,
    "helpAfterwards" BOOLEAN,
    "acceptPhotos" BOOLEAN NOT NULL,
    "acceptCoC" BOOLEAN NOT NULL,
    "eventId"           BIGINT NOT NULL,
    "userId"            UUID   NOT NULL,
    "participationRole" TEXT,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
                        "id"        BIGSERIAL    NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
                        "endDate"   TIMESTAMP(3) NOT NULL,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presences"
(
  "id"      BIGSERIAL    NOT NULL,
  "date"    TIMESTAMP(3) NOT NULL,
  "status"  TEXT         NOT NULL,
  "userId"  UUID         NOT NULL,
  "eventId" BIGINT       NOT NULL,

  CONSTRAINT "presences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personalDatas_userId_key" ON "personalDatas"("userId");

-- CreateIndex
CREATE INDEX "personalDatas_userId_idx" ON "personalDatas" ("userId");

-- CreateIndex
CREATE INDEX "participations_userId_idx" ON "participations" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "events_name_key" ON "events" ("name");

-- CreateIndex
CREATE INDEX "presences_userId_idx" ON "presences" ("userId");

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presences"
  ADD CONSTRAINT "presences_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
