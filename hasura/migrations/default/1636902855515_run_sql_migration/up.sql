create trigger check_bid after insert on transactions for each row execute procedure trigger_check_bid();
