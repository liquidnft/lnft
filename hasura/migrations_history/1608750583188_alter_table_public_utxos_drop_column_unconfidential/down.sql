ALTER TABLE "public"."utxos" ADD COLUMN "unconfidential" text;
ALTER TABLE "public"."utxos" ALTER COLUMN "unconfidential" DROP NOT NULL;
