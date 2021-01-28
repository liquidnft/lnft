CREATE OR REPLACE FUNCTION public.artwork_last_tx(artwork_row artworks)
 RETURNS timestamp with time zone
 LANGUAGE sql
 STABLE
AS $function$
    SELECT max(transactions.created_at)
    FROM transactions
    WHERE transactions.artwork_id = artwork_row.id
$function$;
