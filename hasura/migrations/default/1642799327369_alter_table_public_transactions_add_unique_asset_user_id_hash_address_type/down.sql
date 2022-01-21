alter table "public"."transactions" drop constraint "transactions_asset_user_id_hash_address_type_key";
alter table "public"."transactions" add constraint "transactions_asset_user_id_hash_address_key" unique ("asset", "user_id", "hash", "address");
