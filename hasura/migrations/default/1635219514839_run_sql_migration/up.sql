CREATE OR REPLACE FUNCTION public.artwork_is_locked(artwork_row public.artworks, user_id uuid, edition_key uuid) returns boolean
    stable
    language sql
as
$function$
SELECT COALESCE(every(key_is_owned), artwork_row.locked_by IS NOT NULL)
FROM (SELECT id IS NULL as key_is_owned
      FROM artworks A
      WHERE
              user_id = A.owner_id
        AND edition_key = A.edition_id
        AND artwork_row.locked_by = A.edition_id) B;
$function$
