alter table "public"."users"
  add constraint "users_last_seen_tx_fkey"
  foreign key ("last_seen_tx")
  references "public"."transactions"
  ("id") on update restrict on delete set null;
