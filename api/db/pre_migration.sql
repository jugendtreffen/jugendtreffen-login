-- Drop ForeignKey connecting public and auth schemas
ALTER TABLE public."personalDatas" DROP CONSTRAINT "personalDatas_users_fkey";
