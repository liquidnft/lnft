CREATE OR REPLACE VIEW "public"."activebids" AS 
 SELECT t.psbt,
    t.user_id
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE (((t.type = 'bid'::text) AND (a.transferred_at IS NULL)) OR (t.created_at > a.transferred_at)) AND NOT EXISTS (select t.id from transactions t2 where t2.amount > t.amount AND t2.artwork_id = t.artwork_id);
