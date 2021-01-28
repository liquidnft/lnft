CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."artworks"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
