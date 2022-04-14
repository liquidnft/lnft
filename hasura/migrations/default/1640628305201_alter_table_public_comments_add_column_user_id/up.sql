alter table "public"."comments" add column "user_id" uuid
 not null unique;
