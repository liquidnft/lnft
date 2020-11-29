alter table "public"."addresses" drop constraint "addresses_wallet_id_fkey",
          add constraint "addresses_user_id_fkey"
          foreign key ("wallet_id")
          references "public"."users"
          ("id")
          on update restrict
          on delete restrict;
