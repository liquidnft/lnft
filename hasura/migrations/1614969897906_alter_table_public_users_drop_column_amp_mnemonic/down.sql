ALTER TABLE "public"."users" ADD COLUMN "amp_mnemonic" text;
ALTER TABLE "public"."users" ALTER COLUMN "amp_mnemonic" DROP NOT NULL;
