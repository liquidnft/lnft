alter table "public"."announcements" add column "visible_start" timestamptz
 null default now();
