CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT T.artwork_id,
    max(T.amount) AS amount
   FROM transactions T
   JOIN artworks A ON T.artwork_id = A.id 
   WHERE T.created_at > A.transferred_at
  GROUP BY T.artwork_id;
