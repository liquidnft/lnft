CREATE OR REPLACE FUNCTION public.user_followed(user_row users, hasura_session json)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
SELECT EXISTS (
    SELECT 1
    FROM follows F
    WHERE F.follower_id = (hasura_session ->> 'x-hasura-user-id')::uuid AND F.user_id = user_row.id
);
$function$;
