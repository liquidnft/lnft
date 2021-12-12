create function trigger_set_hideable_hash() returns trigger
    language plpgsql
as
$$
BEGIN
    IF NEW.hideable = false THEN
        NEW.hideable_hash = md5(random()::text);
ELSE
        NEW.hideable_hash = null;
end if;
return NEW;
END;
$$;

alter function trigger_set_hideable_hash() owner to postgres;

CREATE TRIGGER trigger_set_hideable_hash BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.trigger_set_hideable_hash();
