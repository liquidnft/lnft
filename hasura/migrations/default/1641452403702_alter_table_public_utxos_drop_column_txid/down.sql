alter table "public"."utxos" alter column "txid" drop not null;
alter table "public"."utxos" add column "txid" text;
