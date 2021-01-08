CREATE OR REPLACE FUNCTION public.trigger_transfer_on_bid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
         UPDATE artworks a
         SET owner_id = NEW.user_id,
         list_price = null,
         reserve_price = null,
         list_price_tx = null,
         auction_start = null,
         auction_end = null,
         asking_asset = null
         WHERE a.id = NEW.artwork_id
         AND a.list_price > 0
         AND a.list_price <= NEW.amount;
         RETURN NEW;
END;
$function$;
