CREATE OR REPLACE FUNCTION public.trigger_set_user_has_samples()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE users SET has_samples = true WHERE id = NEW.user_id AND has_samples = false;

    RETURN NEW; 
END;
$function$;
