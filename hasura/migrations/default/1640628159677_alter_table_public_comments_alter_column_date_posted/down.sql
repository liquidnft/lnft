alter table "public"."comments" rename column "created_at" to "date_posted";
ALTER TABLE "public"."comments" ALTER COLUMN "date_posted" drop default;
