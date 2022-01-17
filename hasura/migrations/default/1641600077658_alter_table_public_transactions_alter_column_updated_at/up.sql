update "public"."transactions" set "updated_at" = now() where updated_at is null;
alter table "public"."transactions" alter column "updated_at" set default now();
alter table "public"."transactions" alter column "updated_at" set not null;
