CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT t.artwork_id,
    max(t.amount) AS amount
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE (t.created_at > a.transferred_at) OR a.transferred_at is null
  GROUP BY t.artwork_id;
