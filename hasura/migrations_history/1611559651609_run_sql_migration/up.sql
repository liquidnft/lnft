CREATE OR REPLACE VIEW "public"."search" AS 
 SELECT a.id,
    a.title AS s,
    'artwork'::text AS type
   FROM artworks a
UNION
 SELECT u.id,
    u.username AS s,
    'user'::text AS type
   FROM users u
UNION
 SELECT DISTINCT null::uuid AS id,
    t.tag AS s,
    'tag'::text AS type
   FROM tags t;
