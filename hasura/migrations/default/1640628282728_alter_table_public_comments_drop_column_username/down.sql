alter table "public"."comments" alter column "username" drop not null;
alter table "public"."comments" add column "username" text;
