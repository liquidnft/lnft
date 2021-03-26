create view recentactivity as select t1.* from transactions t1 join (
SELECT transactions.artwork_id,
        max(transactions.created_at) AS max_created_at
        FROM transactions
        WHERE (transactions.type <> 'receipt'::text)
        GROUP BY transactions.artwork_id
        
        ) as t2 on t1.artwork_id = t2.artwork_id and t1.created_at = t2.max_created_at order by t1.created_at desc limit 20;
