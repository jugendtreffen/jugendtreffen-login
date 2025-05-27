-- AddForeignKey connecting auth.users with personalData (check umgeht die Shaddow Db)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
ALTER TABLE public."personalDatas"
  ADD CONSTRAINT "personalDatas_users_fkey" FOREIGN KEY ("userId")
    REFERENCES auth.users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
END IF;
IF
EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
ALTER TABLE public."participations"
  ADD CONSTRAINT "participations_users_fkey" FOREIGN KEY ("userId")
    REFERENCES auth.users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
END IF;
END $$;
