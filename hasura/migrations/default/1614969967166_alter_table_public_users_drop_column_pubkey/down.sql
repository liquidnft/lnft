ALTER TABLE "public"."users" ADD COLUMN "pubkey" text;
ALTER TABLE "public"."users" ALTER COLUMN "pubkey" DROP NOT NULL;
