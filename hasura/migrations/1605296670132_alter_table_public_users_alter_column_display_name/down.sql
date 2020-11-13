ALTER TABLE "public"."users" ALTER COLUMN "display_name" DROP NOT NULL;
alter table "public"."users" rename column "username" to "display_name";
