CREATE OR REPLACE FUNCTION public.artwork_has_royalty(artwork_row artworks)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
    SELECT EXISTS(
        SELECT 1 FROM public.royalty_recipients
            WHERE artwork_id = artwork_row.id
    );
$function$;
