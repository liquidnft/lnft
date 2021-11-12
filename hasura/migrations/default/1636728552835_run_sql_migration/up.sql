CREATE OR REPLACE FUNCTION public.artwork_sequence(artwork_row artworks)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
    SELECT regexp_replace(artworks.title, '^.* ', '')::int
    FROM artworks
$function$;
