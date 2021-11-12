CREATE OR REPLACE VIEW "public"."sequenced" AS 
SELECT *, regexp_replace(artworks.title, '^.* ', '')::int as sequence
FROM artworks;
