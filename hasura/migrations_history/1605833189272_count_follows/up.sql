CREATE OR REPLACE FUNCTION public.user_follows(user_row users)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT count(*)
    FROM follows F
    WHERE F.user_id = user_row.id
$function$;
