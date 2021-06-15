CREATE OR REPLACE VIEW "public"."activebids" AS 
 SELECT 
    t.psbt,
    t.user_id
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE (((t.type = 'bid'::text) AND (a.transferred_at IS NULL)) OR (t.created_at > a.transferred_at));
