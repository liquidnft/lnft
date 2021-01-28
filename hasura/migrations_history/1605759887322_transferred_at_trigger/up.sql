CREATE TRIGGER set_transferred_at
BEFORE UPDATE ON artworks
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_transferred_at();
