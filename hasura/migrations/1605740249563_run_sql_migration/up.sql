CREATE OR REPLACE FUNCTION public.artwork_bid(artwork_row artworks)
 RETURNS SETOF transactions
 LANGUAGE sql
 STABLE
AS $function$
    SELECT *
    FROM transactions T
    WHERE T.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$function$;
