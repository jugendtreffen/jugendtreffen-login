-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('admin', 'checkin', 'quartier', 'none');

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "role" "UserRoleEnum" NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_key" ON "user_roles"("userId", "role");

-- Custom JWT Auth hook
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE
claims jsonb;
  user_role public."UserRoleEnum";
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE "userId" = (event->>'user_id')::uuid;
  RAISE LOG 'Access Token Hook fired for user: %, found role: %', event->>'user_id', user_role;
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', coalesce(to_jsonb(user_role), 'null'));
  event  := jsonb_set(event, '{claims}', claims);
RETURN event;
END;
$$;

-- Manage access
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
grant all on table public.user_roles to supabase_auth_admin;

-- Custom Trigger for assigning a default role to each new user

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_roles ("id", "userId", "role")
  VALUES (gen_random_uuid(), NEW.id, 'none');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
