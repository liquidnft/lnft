CREATE UNIQUE INDEX "artworks_created_at_key" on
  "public"."artworks" using btree ("created_at");
