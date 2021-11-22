create trigger check_bid before insert on transactions for each row execute procedure trigger_check_bid();
