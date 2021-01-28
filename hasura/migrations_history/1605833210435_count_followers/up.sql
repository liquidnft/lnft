CREATE OR REPLACE FUNCTION public.user_followers(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT count(*)
    FROM follows F
    WHERE F.follower_id = user_row.id
$function$;
