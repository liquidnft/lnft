CREATE TABLE "public"."utxos" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "txid" text NOT NULL, "vout" integer NOT NULL, "asset" text NOT NULL, "value" integer NOT NULL, "address" text NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
