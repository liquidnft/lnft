CREATE OR REPLACE VIEW "public"."activebids" AS 
 SELECT t.psbt,
    t.user_id,
    t.amount,
    t.artwork_id,
    t.id
   FROM (transactions t
     JOIN artworks a ON ((t.artwork_id = a.id)))
  WHERE ((t.type = 'bid'::text) AND ((a.transferred_at IS NULL) OR (t.created_at > a.transferred_at)) AND (NOT (EXISTS ( SELECT t.id
           FROM transactions t2
          WHERE ((t2.type = 'bid'::text) AND ((a.transferred_at IS NULL) OR (t2.created_at > a.transferred_at)) AND (t2.amount > t.amount) AND (t2.artwork_id = t.artwork_id))))));
