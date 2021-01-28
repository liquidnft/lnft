ALTER TABLE "public"."artworks" ADD COLUMN "managed" bool;
ALTER TABLE "public"."artworks" ALTER COLUMN "managed" DROP NOT NULL;
ALTER TABLE "public"."artworks" ALTER COLUMN "managed" SET DEFAULT false;
