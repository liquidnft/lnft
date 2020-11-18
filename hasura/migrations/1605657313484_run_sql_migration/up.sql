CREATE VIEW offers AS
  SELECT artwork_id, user_id, max(amount)
    FROM transactions
    GROUP BY artwork_id, user_id;
