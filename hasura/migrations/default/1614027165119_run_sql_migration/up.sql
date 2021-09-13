CREATE OR REPLACE VIEW "public"."collectors" AS 
 SELECT u.id,
    u.created_at,
    u.updated_at,
    u.username,
    u.avatar_url,
    u.display_name,
    u.location,
    u.bio,
    u.website,
    u.email,
    u.full_name,
    ( SELECT count(*) AS count
           FROM artworks a
          WHERE (u.id = a.owner_id)) AS num_artworks,
              u.address
   FROM users u
  ORDER BY ( SELECT count(*) AS count
           FROM artworks a
          WHERE (u.id = a.owner_id)) DESC;
