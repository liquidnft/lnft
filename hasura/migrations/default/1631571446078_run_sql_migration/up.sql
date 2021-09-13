CREATE OR REPLACE FUNCTION public.trigger_check_bid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE bid INTEGER;
DECLARE bid_increment INTEGER;
DECLARE reserve_price INTEGER;
DECLARE auction_end TIMESTAMP;
BEGIN
    IF NEW.type = 'bid' THEN
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
        
        SELECT artworks.bid_increment, artworks.auction_end, artworks.reserve_price
        FROM artworks
        WHERE id = NEW.artwork_id
        INTO bid_increment, auction_end, reserve_price;

      IF NEW.amount < reserve_price OR (bid is not null and NEW.amount < (bid + bid_increment) AND auction_end >= NOW()) THEN
          RAISE EXCEPTION 'Bid of % below minimum bid of % % %', NEW.amount, GREATEST(reserve_price, bid + bid_increment), reserve_price, bid;
      END IF;
    END IF;

  RETURN NEW;
END;
$function$;
