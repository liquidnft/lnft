alter table "public"."addresses" drop constraint "addresses_user_id_fkey",
          add constraint "addresses_wallet_id_fkey"
          foreign key ("user_id")
          references "public"."wallets"
          ("id")
          on update restrict
          on delete restrict;
