alter table "public"."transactions" drop constraint "transactions_bid_id_fkey",
  add constraint "transactions_bid_id_fkey"
  foreign key ("bid_id")
  references "public"."transactions"
  ("id") on update restrict on delete set null;
