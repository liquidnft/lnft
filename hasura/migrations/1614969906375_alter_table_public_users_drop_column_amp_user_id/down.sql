ALTER TABLE "public"."users" ADD COLUMN "amp_user_id" int4;
ALTER TABLE "public"."users" ALTER COLUMN "amp_user_id" DROP NOT NULL;
