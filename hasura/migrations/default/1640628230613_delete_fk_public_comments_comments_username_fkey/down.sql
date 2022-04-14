alter table "public"."comments"
  add constraint "comments_username_fkey"
  foreign key ("username")
  references "public"."users"
  ("username") on update restrict on delete restrict;
