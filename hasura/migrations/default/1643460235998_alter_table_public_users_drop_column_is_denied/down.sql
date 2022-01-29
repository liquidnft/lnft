alter table "public"."users" alter column "is_denied" set default false;
alter table "public"."users" alter column "is_denied" drop not null;
alter table "public"."users" add column "is_denied" bool;
