CREATE TABLE "public"."royalty_recipients" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "artwork_id" uuid NOT NULL, "asking_asset" text NOT NULL, "amount" bigint NOT NULL, "address" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_royalty_recipients_updated_at"
BEFORE UPDATE ON "public"."royalty_recipients"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_royalty_recipients_updated_at" ON "public"."royalty_recipients" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
