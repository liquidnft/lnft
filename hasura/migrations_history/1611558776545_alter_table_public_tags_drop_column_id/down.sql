ALTER TABLE "public"."tags" ADD COLUMN "id" uuid;
ALTER TABLE "public"."tags" ALTER COLUMN "id" DROP NOT NULL;
ALTER TABLE "public"."tags" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
