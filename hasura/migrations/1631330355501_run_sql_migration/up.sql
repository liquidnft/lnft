CREATE OR REPLACE VIEW "public"."activebids" AS 
 SELECT t.psbt,
    t.user_id,
    t.amount,
    t.artwork_id,
    t.id,
    t.hash
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE ((t.type = 'bid'::text OR t.type = 'return'::text) AND ((a.transferred_at IS NULL) OR (t.created_at > a.transferred_at)));
