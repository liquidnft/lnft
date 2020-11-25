CREATE OR REPLACE FUNCTION public.trigger_tx_on_artwork()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
         INSERT INTO transactions (artwork_id, amount, hash, type, user_id)
  VALUES (NEW.id, 0, '12345', 'creation', NEW.owner_id);
 
    RETURN NEW;
END;
$function$;
