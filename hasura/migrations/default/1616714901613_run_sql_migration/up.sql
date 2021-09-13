CREATE OR REPLACE VIEW "public"."recentactivity" AS 
 SELECT t1.id,
    t1.artist_id,
    t1.title,
    t1.owner_id,
    t1.description,
    t1.filename,
    t1.created_at,
    t1.list_price,
    t1.transferred_at,
    t1.asset,
    t1.auction_end,
    t1.list_price_tx,
    t1.asking_asset,
    t1.auction_start,
    t1.editions,
    t1.reserve_price,
    t1.ticker,
    t1.royalty,
    t1.max_extensions,
    t1.extension_interval,
    t1.bid_increment,
    t1.filetype,
    t1.views,
    t1.edition,
    t1.slug,
    t1.auction_release_tx,
    t1.is_physical,
    t1.instagram
   FROM (artworks t1
     JOIN ( SELECT transactions.artwork_id,
            max(transactions.created_at) AS max_created_at
           FROM transactions
           WHERE type != 'receipt'
          GROUP BY transactions.artwork_id) t2 ON (((t1.id = t2.artwork_id) AND (t1.created_at = t2.max_created_at))))
  ORDER BY t1.created_at DESC;
