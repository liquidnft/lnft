CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT t.artwork_id,
    max(t.amount) AS amount,
    t.psbt,
    t.id
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE (((t.created_at > a.transferred_at) OR (a.transferred_at IS NULL)) AND (t.type = 'bid'::text))
  GROUP BY t.artwork_id, t.psbt, t.id;
