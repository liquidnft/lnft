CREATE OR REPLACE FUNCTION public.update_bid_price()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
   row_count integer;
BEGIN
WITH rows AS (
	UPDATE artworks SET bid_price = NEW.amount 
	WHERE artworks.id = NEW.artwork_id 
	AND (artworks.bid_price IS NULL OR NEW.amount > artworks.bid_price) RETURNING 1
) SELECT count(*) INTO row_count FROM rows;
	IF row_count > 0 THEN
	  RETURN NEW;
	ELSE 
	  RAISE EXCEPTION 'new bid must be higher than current bid';
	END IF;
END;
$function$;
