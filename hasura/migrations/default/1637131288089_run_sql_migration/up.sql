create trigger update_bid after insert on transactions for each row execute procedure trigger_update_bid();
