ALTER TABLE "public"."artworks" ADD COLUMN "bid_id" uuid;
ALTER TABLE "public"."artworks" ALTER COLUMN "bid_id" DROP NOT NULL;
ALTER TABLE "public"."artworks" ADD CONSTRAINT artworks_bid_id_fkey FOREIGN KEY (bid_id) REFERENCES "public"."transactions" (id) ON DELETE restrict ON UPDATE restrict;
