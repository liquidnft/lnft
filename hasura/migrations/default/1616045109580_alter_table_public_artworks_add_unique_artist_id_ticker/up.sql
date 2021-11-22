alter table "public"."artworks" add constraint "artworks_artist_id_ticker_key" unique ("artist_id", "ticker");
