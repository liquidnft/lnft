CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT transactions.artwork_id,
    transactions.user_id,
    max(transactions.amount) AS bid
   FROM transactions
  GROUP BY transactions.artwork_id, transactions.user_id;
