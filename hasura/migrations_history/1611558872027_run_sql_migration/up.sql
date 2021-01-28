CREATE OR REPLACE VIEW "public"."search" AS
 SELECT a.id, a.title as s, 'artwork' as type FROM artworks a
 UNION
 SELECT u.id, u.username as s, 'user' as type FROM users u
 UNION
 SELECT DISTINCT uuid_generate_v4() as id, t.tag as s, 'tag' as type FROM tags t;
