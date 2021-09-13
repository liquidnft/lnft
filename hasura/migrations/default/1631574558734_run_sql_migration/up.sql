CREATE OR REPLACE FUNCTION public.artwork_artist_owned(artwork_row artworks, hasura_session json)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
SELECT artist_id = owner_id FROM artworks WHERE id = artwork_row.id
$function$;
