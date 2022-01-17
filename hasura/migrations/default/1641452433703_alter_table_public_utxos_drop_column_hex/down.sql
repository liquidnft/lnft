alter table "public"."utxos" alter column "hex" drop not null;
alter table "public"."utxos" add column "hex" text;
