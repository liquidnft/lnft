CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."transactions"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "hash" text NOT NULL, "artwork_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON UPDATE restrict ON DELETE cascade, UNIQUE ("id"));
