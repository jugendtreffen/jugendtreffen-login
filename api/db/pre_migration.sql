-- Drop ForeignKey connecting public and auth schemas
ALTER TABLE public."personalDatas" DROP CONSTRAINT "personalDatas_userId_fkey";
