ALTER TABLE "public"."transactions" ADD COLUMN "user_id" int4;
ALTER TABLE "public"."transactions" ALTER COLUMN "user_id" DROP NOT NULL;
