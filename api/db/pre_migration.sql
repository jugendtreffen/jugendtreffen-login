-- Drop ForeignKey connecting public and auth schemas
ALTER TABLE public."personalDatas" DROP CONSTRAINT "personalDatas_users_fkey";
ALTER TABLE public."participations" DROP CONSTRAINT "participations_users_fkey";
