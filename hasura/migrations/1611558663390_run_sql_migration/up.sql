CREATE OR REPLACE VIEW "public"."search" AS
 SELECT a.id, a.title as s FROM artworks a
 UNION
 SELECT u.id, u.username as s FROM users u
 UNION
 SELECT t.id, t.tag as s FROM tags t;
