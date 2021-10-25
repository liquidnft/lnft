CREATE OR REPLACE VIEW "public"."activelistings" AS 
 SELECT t.psbt,
    t.user_id,
    t.amount,
    t.artwork_id,
    t.id,
    t.hash,
    t.created_at
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE ((t.type = 'listing'::text) AND (t.psbt = a.list_price_tx));
