CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT t.artwork_id,
    t.amount,
    t.psbt,
    t.id
   FROM (transactions t
     JOIN artworks a ON (((t.artwork_id = a.id) AND (((t.created_at > a.transferred_at) OR (a.transferred_at IS NULL)) AND (t.type = 'bid'::text)))))
  WHERE (t.amount = ( SELECT max(t2.amount) AS max
           FROM transactions t2
          WHERE (t2.artwork_id = t.artwork_id) AND t2.type = 'bid'::text));
