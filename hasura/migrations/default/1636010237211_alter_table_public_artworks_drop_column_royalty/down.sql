alter table "public"."artworks" alter column "royalty" drop not null;
alter table "public"."artworks" add column "royalty" int4;
