ALTER TABLE "public"."transactions" ADD COLUMN "bid_id" int4;
ALTER TABLE "public"."transactions" ALTER COLUMN "bid_id" DROP NOT NULL;
