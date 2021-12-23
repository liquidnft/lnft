alter table "public"."users" add column "is_denied" boolean
 not null default 'false';
