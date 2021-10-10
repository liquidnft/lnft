alter table "public"."royalty_recipients" add column "type" text
 not null default 'system';
