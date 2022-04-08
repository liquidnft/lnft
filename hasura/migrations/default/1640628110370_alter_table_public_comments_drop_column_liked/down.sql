alter table "public"."comments" alter column "liked" drop not null;
alter table "public"."comments" add column "liked" bool;
