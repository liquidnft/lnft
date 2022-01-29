CREATE TRIGGER unset_user_has_samples
    AFTER DELETE ON samples
    FOR EACH ROW
    EXECUTE FUNCTION trigger_unset_user_has_samples();
