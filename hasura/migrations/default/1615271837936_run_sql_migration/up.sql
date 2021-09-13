create trigger extend_auction after insert on transactions for each row execute procedure trigger_extend_auction();
