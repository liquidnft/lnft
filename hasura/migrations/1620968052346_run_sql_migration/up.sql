CREATE OR REPLACE FUNCTION public.trigger_extend_auction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE bid INTEGER;
BEGIN
  SELECT transactions.amount
    FROM transactions
    JOIN artworks ON transactions.artwork_id = artworks.id
    WHERE transactions.artwork_id = NEW.artwork_id
    AND transactions.type = 'bid'
    AND (transactions.created_at > artworks.transferred_at
    OR artworks.transferred_at IS NULL)
    ORDER BY amount DESC
    LIMIT 1
    INTO bid;
    
  IF NEW.amount < bid + 1000 THEN
      RAISE EXCEPTION 'Bid too low';
  END IF;

  UPDATE artworks SET auction_end = GREATEST(NOW() + interval '1 minute', auction_end) WHERE id = NEW.artwork_id AND NEW.type = 'bid' AND auction_end is not null AND auction_end > now();
  RETURN NEW;
END;
$function$;
