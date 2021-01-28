CREATE OR REPLACE VIEW "public"."collectors" AS
SELECT
  u.*, 
  (
    SELECT count(*) 
    FROM artworks a 
    WHERE u.id = a.owner_id
  ) AS num_artworks
FROM
users u
ORDER BY num_artworks DESC;
