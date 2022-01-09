alter table "public"."transactions" alter column "updated_at" set default now();
alter table "public"."transactions" alter column "updated_at" set not null;
