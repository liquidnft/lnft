alter table "public"."users"
  add constraint "users_last_seen_tx_fkey"
  foreign key (last_seen_tx)
  references "public"."transactions"
  (id) on update restrict on delete set null;
alter table "public"."users" alter column "last_seen_tx" drop not null;
alter table "public"."users" add column "last_seen_tx" uuid;
