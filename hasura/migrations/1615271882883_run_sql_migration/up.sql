CREATE OR REPLACE FUNCTION public.trigger_extend_auction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE artworks SET auction_end = GREATEST(NOW() + interval '15 minutes', auction_end) WHERE id = NEW.artwork_id AND NEW.type = 'bid';
  RETURN NEW;
END;
$function$;
