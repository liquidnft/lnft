create trigger cancel_bid after update on transactions for each row execute procedure trigger_cancel_bid();
