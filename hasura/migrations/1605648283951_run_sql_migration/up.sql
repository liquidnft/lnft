CREATE TRIGGER set_bid_price
  BEFORE INSERT
  ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_bid_price();
