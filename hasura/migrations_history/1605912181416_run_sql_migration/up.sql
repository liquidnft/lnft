CREATE OR REPLACE FUNCTION public.artwork_bid2(artwork_row artworks)
 RETURNS transactions
 LANGUAGE sql
 STABLE
AS $function$
    SELECT transactions.*
    FROM transactions
    JOIN artworks ON transactions.artwork_id = artworks.id
    WHERE transactions.artwork_id = artwork_row.id
    AND (transactions.created_at > artworks.transferred_at
    OR artworks.transferred_at IS NULL)
    ORDER BY amount DESC
    LIMIT 1
$function$;
