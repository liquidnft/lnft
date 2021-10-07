ALTER TABLE "public"."artworks" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0;
