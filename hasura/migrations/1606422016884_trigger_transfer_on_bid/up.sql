CREATE TRIGGER transfer_on_bid
  AFTER INSERT
  ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_transfer_on_bid();
