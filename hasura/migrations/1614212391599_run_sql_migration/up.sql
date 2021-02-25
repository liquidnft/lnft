Create or replace view artists as
 SELECT u.id,
    u.username,
    u.avatar_url,
    ( SELECT count(*) AS count
           FROM artworks a
          WHERE u.id = a.artist_id) AS creations,
    ( SELECT count(*) AS count
           FROM artworks a
          WHERE u.id = a.artist_id AND u.id != a.owner_id) AS sold,
    ( SELECT (abs(avg(t.amount)) / (100000000)::numeric) AS avg
           FROM transactions t
           JOIN artworks a on a.id = t.artwork_id AND a.artist_id = u.id
          WHERE ((t.user_id = u.id) AND (t.type = 'receipt'::text))) AS avg_sale,
    ( SELECT (abs(max(t.amount)) / (100000000)::numeric) AS max
           FROM transactions t
           JOIN artworks a on a.id = t.artwork_id AND a.artist_id = u.id
          WHERE ((t.user_id = u.id) AND (t.type = 'receipt'::text))) AS highest_sale,
    ( SELECT (abs(sum(t.amount)) / (100000000)::numeric) AS sum
           FROM transactions t
           JOIN artworks a on a.id = t.artwork_id AND a.artist_id = u.id
          WHERE ((t.user_id = u.id) AND (t.type = 'receipt'::text))) AS total_sales
   FROM users u
  WHERE (SELECT count(*) AS count
           FROM artworks a
          WHERE u.id = a.artist_id) > 0
  ORDER BY total_sales DESC;
