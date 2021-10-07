alter table "public"."default_royalty_recipients"
  add constraint "default_royalty_recipients_artwork_id_fkey"
  foreign key ("artwork_id")
  references "public"."artworks"
  ("id") on update restrict on delete restrict;
