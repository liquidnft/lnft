CREATE OR REPLACE FUNCTION public.searchable(t text)
 RETURNS SETOF search
 LANGUAGE sql
 STABLE
AS $function$ 
SELECT   * 
FROM     search 
WHERE    t <% ( s ) 
ORDER BY similarity(t, ( s )) DESC limit 5; 

$function$;
