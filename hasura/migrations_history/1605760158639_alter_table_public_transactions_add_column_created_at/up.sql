ALTER TABLE "public"."transactions" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now();
