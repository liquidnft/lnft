ALTER TABLE "public"."users" ADD COLUMN "multisig" text;
ALTER TABLE "public"."users" ALTER COLUMN "multisig" DROP NOT NULL;
