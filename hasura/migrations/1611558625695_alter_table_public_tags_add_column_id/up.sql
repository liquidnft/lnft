ALTER TABLE "public"."tags" ADD COLUMN "id" UUID NOT NULL DEFAULT uuid_generate_v4();
