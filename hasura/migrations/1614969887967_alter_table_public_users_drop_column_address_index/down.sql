ALTER TABLE "public"."users" ADD COLUMN "address_index" int4;
ALTER TABLE "public"."users" ALTER COLUMN "address_index" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "address_index" SET DEFAULT 0;
