ALTER TABLE "public"."artworks" ADD COLUMN "bid_price" int4;
ALTER TABLE "public"."artworks" ALTER COLUMN "bid_price" DROP NOT NULL;
