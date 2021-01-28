alter table "public"."artworks" drop constraint "artworks_user_id_fkey",
             add constraint "artworks_user_id_fkey"
             foreign key ("user_id")
             references "public"."users"
             ("id") on update restrict on delete cascade;
