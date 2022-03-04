alter table "public"."announcements" add column "visible_end" timestamptz
 not null default now();
