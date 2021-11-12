alter table "public"."default_royalty_recipients" alter column "artwork_id" drop not null;
alter table "public"."default_royalty_recipients" add column "artwork_id" uuid;
