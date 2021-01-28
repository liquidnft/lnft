CREATE OR REPLACE FUNCTION public.artwork_favorited(artwork_row artworks, hasura_session json)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
SELECT EXISTS (
    SELECT 1
    FROM favorites F
    WHERE F.user_id = (hasura_session ->> 'x-hasura-user-id')::uuid AND F.artwork_id = artwork_row.id
);
$function$;
