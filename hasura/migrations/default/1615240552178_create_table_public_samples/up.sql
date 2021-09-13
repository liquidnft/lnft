CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."samples"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "url" text NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
