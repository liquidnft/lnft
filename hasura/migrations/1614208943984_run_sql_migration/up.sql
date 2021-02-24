CREATE OR REPLACE VIEW "public"."collectors" AS 
 
 SELECT u.id,
    u.username,
    u.avatar_url,
    ( SELECT count(*) AS count
           FROM artworks a
          WHERE (u.id = a.owner_id)) AS owned,
    ( SELECT count(*) AS count
           FROM transactions t
          WHERE (((u.id = t.user_id) AND (t.type = 'purchase'::text)) OR (t.type = 'creation'::text))) AS collected,
    ( SELECT count(*) AS count
           FROM (transactions t
             JOIN artworks a ON ((a.id = t.artwork_id)))
          WHERE ((u.id = t.user_id) AND (t.type = 'receipt'::text) AND (u.id <> a.artist_id))) AS resold,
    ( SELECT (abs(avg(t.amount)) / (100000000)::numeric) AS avg
           FROM transactions t
          WHERE ((t.user_id = u.id) AND (t.type = 'purchase'::text))) AS avg_price,
    ( SELECT abs(sum(t.amount/(100000000)::numeric)) AS sum
           FROM transactions t
          WHERE ((t.user_id = u.id) AND (t.type = 'purchase'::text))) AS total_price,
    u.address
   FROM users u
  ORDER BY ( SELECT count(*) AS count
           FROM artworks a
          WHERE (u.id = a.owner_id)) DESC;
