CREATE OR REPLACE FUNCTION public.trigger_extend_auction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE artworks SET auction_end = GREATEST(NOW() + interval '1 minutes', auction_end) WHERE id = NEW.artwork_id AND NEW.type = 'bid' AND auction_end is not null AND auction_end > now();
  RETURN NEW;
END;
$function$;
