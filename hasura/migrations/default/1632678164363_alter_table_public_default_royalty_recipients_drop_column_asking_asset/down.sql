alter table "public"."default_royalty_recipients" alter column "asking_asset" drop not null;
alter table "public"."default_royalty_recipients" add column "asking_asset" text;
