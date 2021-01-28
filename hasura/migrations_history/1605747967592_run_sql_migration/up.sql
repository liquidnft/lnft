CREATE OR REPLACE FUNCTION public.artwork_bid2(artwork_row artworks)
 RETURNS transactions
 LANGUAGE sql
 STABLE
AS $function$
    SELECT *
    FROM transactions
    WHERE transactions.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$function$;
