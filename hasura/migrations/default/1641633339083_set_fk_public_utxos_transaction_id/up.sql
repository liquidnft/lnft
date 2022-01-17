alter table "public"."utxos"
  add constraint "utxos_transaction_id_fkey"
  foreign key ("transaction_id")
  references "public"."transactions"
  ("id") on update cascade on delete cascade;
