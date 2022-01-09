alter table "public"."transactions" add constraint "transactions_hash_asset_user_id_key" unique ("hash", "asset", "user_id");
