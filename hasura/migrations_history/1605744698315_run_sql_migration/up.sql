CREATE OR REPLACE FUNCTION artwork_bid (artwork_row artworks)
 RETURNS SETOF transactions
 LANGUAGE sql
 STABLE
AS $function$
    SELECT *
    FROM transactions
    WHERE transactions.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$function$;
