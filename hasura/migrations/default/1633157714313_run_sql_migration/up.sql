CREATE OR REPLACE VIEW userstats AS
SELECT count(distinct id) as users, count(artist_id) as artworks, is_artist, user_created::date, artwork_created::date  FROM
    (SELECT  U.id, artist_id, is_artist, U.created_at as user_created, A.created_at as artwork_created
     FROM public.artworks A
              RIGHT JOIN
          (SELECT id, is_artist, created_at
           FROM public.users) U ON U.id = A.artist_id) as x group by is_artist, user_created, artwork_created
