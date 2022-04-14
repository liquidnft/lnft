alter table "public"."comments" alter column "date_posted" set default now();
alter table "public"."comments" rename column "date_posted" to "created_at";
