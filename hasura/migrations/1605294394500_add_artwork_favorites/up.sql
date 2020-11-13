CREATE OR REPLACE FUNCTION public.artwork_favorites(artwork_row artworks, hasura_session json)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT count(*)
    FROM favorites F
    WHERE F.artwork_id = artwork_row.id
$function$;
