CREATE OR REPLACE VIEW "public"."search" AS 
 SELECT a.id,
    CASE WHEN a.editions > 1 THEN a.title || ' (Edition ' || a.edition || ' of ' || a.editions || ')' ELSE a.title END AS s,
    'artwork'::text AS type
   FROM artworks a
UNION
 SELECT u.id,
    u.username AS s,
    'user'::text AS type
   FROM users u
UNION
 SELECT DISTINCT NULL::uuid AS id,
    t.tag AS s,
    'tag'::text AS type
   FROM tags t;
