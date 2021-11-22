alter table "public"."transactions" add constraint "transactions_hash_type_key" unique ("hash", "type");
