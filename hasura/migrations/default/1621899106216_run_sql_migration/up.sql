CREATE OR REPLACE FUNCTION public.trigger_check_bid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE bid INTEGER;
DECLARE bid_increment INTEGER;
BEGIN
    SELECT transactions.amount, artworks.bid_increment
    FROM transactions
    JOIN artworks ON transactions.artwork_id = artworks.id
    WHERE transactions.artwork_id = NEW.artwork_id
    AND transactions.type = 'bid'
    AND (transactions.created_at > artworks.transferred_at
    OR artworks.transferred_at IS NULL)
    ORDER BY amount DESC
    LIMIT 1
    INTO bid, bid_increment;
    
  IF bid is not null and NEW.amount < (bid + bid_increment) THEN
      RAISE EXCEPTION 'Bid of % below minimum bid of %', NEW.amount, bid + bid_increment;
  END IF;

  RETURN NEW;
END;
$function$;
