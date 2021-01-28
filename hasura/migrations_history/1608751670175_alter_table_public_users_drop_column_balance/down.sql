ALTER TABLE "public"."users" ADD COLUMN "balance" int4;
ALTER TABLE "public"."users" ALTER COLUMN "balance" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "balance" SET DEFAULT 0;
