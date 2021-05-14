CREATE OR REPLACE FUNCTION public.trigger_check_bid()
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
    
  IF bid is not null and NEW.amount < (bid + 1000) THEN
      RAISE EXCEPTION 'Bid of % below minimum bid of %', NEW.amount, bid + 1000;
  END IF;

  RETURN NEW;
END;
$function$;
