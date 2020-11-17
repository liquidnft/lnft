CREATE OR REPLACE FUNCTION public.artwork_bidder(artwork_row artworks, hasura_session json)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
    SELECT U.username
    FROM transactions T
    JOIN users U on
    T.user_id = U.id
    WHERE T.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$function$;
