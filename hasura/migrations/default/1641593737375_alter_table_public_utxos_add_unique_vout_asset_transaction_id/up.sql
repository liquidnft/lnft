alter table "public"."utxos" add constraint "utxos_vout_asset_transaction_id_key" unique ("vout", "asset", "transaction_id");
