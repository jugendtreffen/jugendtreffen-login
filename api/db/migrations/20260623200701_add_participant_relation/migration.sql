-- AddForeignKey
ALTER TABLE "accomodationcheckIn" ADD CONSTRAINT "accomodationcheckIn_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
