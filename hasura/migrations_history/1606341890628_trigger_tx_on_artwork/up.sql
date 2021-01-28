CREATE OR REPLACE FUNCTION trigger_tx_on_artwork()
  RETURNS trigger AS
$$
BEGIN
         INSERT INTO transactions (artwork_id, amount, hash, type)
  VALUES (NEW.id, 0, '12345', 'creation');
 
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER tx_on_artwork
  AFTER INSERT
  ON artworks
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_tx_on_artwork();
