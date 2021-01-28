ALTER TABLE "public"."users" ALTER COLUMN "display_name" SET NOT NULL;
alter table "public"."users" rename column "display_name" to "username";
