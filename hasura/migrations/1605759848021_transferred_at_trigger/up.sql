CREATE OR REPLACE FUNCTION trigger_set_transferred_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.transferred_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
