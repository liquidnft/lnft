CREATE
OR REPLACE FUNCTION public.artwork_is_locked(artwork_row public.artworks, session_data json) returns boolean
    stable
    language sql
as
$function$
SELECT A.locked_by NOT IN
       (SELECT edition_id FROM public.artworks B where B.owner_id::text = session_data->>'x-hasura-user-id')
        AND A.locked_by IS NOT NULL as key_is_owned
FROM public.artworks A
WHERE artwork_row.id = A.id;
$function$
