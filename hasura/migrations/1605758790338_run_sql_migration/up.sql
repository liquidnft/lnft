CREATE OR REPLACE VIEW "public"."offers" AS 
 SELECT transactions.artwork_id,
    max(transactions.amount) AS amount
   FROM transactions
  GROUP BY transactions.artwork_id;
