create or replace view "public"."collectors" AS
 SELECT u.id,
    u.username,
    u.avatar_url,
    ( SELECT count(*)
       FROM artworks a
      WHERE (u.id = a.owner_id)) AS owned,
  ( SELECT count(*)
   FROM transactions t
  WHERE (u.id = t.user_id) and t.type='purchase' or t.type='creation') AS collected,
  ( SELECT count(*)
   FROM transactions t JOIN artworks a on a.id = t.artwork_id
  WHERE (u.id = t.user_id) and t.type='receipt' and u.id != a.artist_id) AS resold,
  ( SELECT AVG(amount)
   FROM transactions t where t.user_id = u.id and t.type = 'purchase') AS avg_price,
   ( SELECT SUM(amount)
   FROM transactions t where t.user_id = u.id and t.type = 'purchase') AS total_price,
    u.address
   FROM users u
  ORDER BY ( owned) DESC;
