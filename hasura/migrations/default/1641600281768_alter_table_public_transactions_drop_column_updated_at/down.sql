alter table "public"."transactions" alter column "updated_at" set default now();
alter table "public"."transactions" alter column "updated_at" drop not null;
alter table "public"."transactions" add column "updated_at" timestamptz;
