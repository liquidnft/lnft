CREATE OR REPLACE FUNCTION public.get_session_role(hasura_session json)
 RETURNS SETOF text_result
 LANGUAGE sql
 STABLE
AS $function$
    SELECT q.* FROM (VALUES (hasura_session ->> 'x-hasura-role')) q
$function$;
