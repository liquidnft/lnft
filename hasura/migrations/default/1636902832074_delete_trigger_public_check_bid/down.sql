CREATE TRIGGER "check_bid"
BEFORE INSERT ON "public"."transactions"
FOR EACH ROW EXECUTE FUNCTION trigger_check_bid();
