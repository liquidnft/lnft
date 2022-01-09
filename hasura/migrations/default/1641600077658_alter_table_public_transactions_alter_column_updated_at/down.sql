alter table "public"."transactions" alter column "updated_at" drop not null;
ALTER TABLE "public"."transactions" ALTER COLUMN "updated_at" drop default;
