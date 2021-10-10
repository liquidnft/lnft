CREATE OR REPLACE FUNCTION public.artwork_locked_content(artwork_row artworks, hasura_session json)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
    SELECT transactions.contract::json->>'locked_content'
    FROM transactions
    JOIN artworks a ON transactions.artwork_id = a.id
    WHERE transactions.artwork_id = artwork_row.id
    AND a.owner_id = (hasura_session ->> 'x-hasura-user-id')::uuid
    AND transactions.contract IS NOT NULL
    AND transactions.contract LIKE '%locked_content%'
    LIMIT 1
$function$;
