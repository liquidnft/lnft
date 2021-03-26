create view recentactivity as SELECT t1.* FROM artworks t1
JOIN (
    SELECT artwork_id, max(created_at) max_created_at
    FROM transactions
    GROUP BY artwork_id
) t2
ON t1.id = t2.artwork_id AND t1.created_at = t2.max_created_at
ORDER BY t1.created_at DESC;
