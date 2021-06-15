CREATE OR REPLACE VIEW "public"."activebids" AS
 SELECT t.*
   FROM transactions t
   JOIN artworks a
   ON t.artwork_id = a.id
   WHERE t.type = 'bid' AND a.transferred_at is null or t.created_at > a.transferred_at;
