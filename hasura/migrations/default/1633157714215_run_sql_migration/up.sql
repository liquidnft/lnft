CREATE OR REPLACE FUNCTION public.artwork_is_sold(artwork_row public.artworks) returns boolean
    stable
    language sql
as
$function$
SELECT transferred_at IS NOT NULL
FROM artworks A
WHERE
        artwork_row.id = A.id;
$function$
