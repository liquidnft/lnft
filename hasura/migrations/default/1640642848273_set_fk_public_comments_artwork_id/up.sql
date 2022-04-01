alter table "public"."comments"
  add constraint "comments_artwork_id_fkey"
  foreign key ("artwork_id")
  references "public"."artworks"
  ("id") on update restrict on delete cascade;
