ALTER TABLE "public"."users" ADD COLUMN "gaid" text;
ALTER TABLE "public"."users" ALTER COLUMN "gaid" DROP NOT NULL;
