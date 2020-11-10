alter table "public"."tags" drop constraint "tags_pkey";
alter table "public"."tags"
    add constraint "tags_pkey" 
    primary key ( "tag", "artwork_id" );
