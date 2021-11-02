alter table "public"."artworks"
  add constraint "artworks_bid_id_fkey"
  foreign key ("bid_id")
  references "public"."transactions"
  ("id") on update restrict on delete restrict;
