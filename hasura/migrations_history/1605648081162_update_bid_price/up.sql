CREATE FUNCTION update_bid_price() 
   RETURNS TRIGGER 
   LANGUAGE PLPGSQL
AS $$
BEGIN
	UPDATE artworks SET bid_price = NEW.amount WHERE artworks.id = NEW.artwork_id;
	RETURN NEW;
END;
$$;
