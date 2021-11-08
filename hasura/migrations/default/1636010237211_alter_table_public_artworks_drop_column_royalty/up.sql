INSERT INTO royalty_recipients 
    (artwork_id, name, asking_asset, amount, address, type) 
     
    (
        SELECT a.id, u.username, '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d' as asking_asset, a.royalty, u.address, 'individual' as type
        FROM artworks a
        INNER JOIN users u ON u.id = a.artist_id
        WHERE 
            royalty IS NOT NULL
    );
    
alter table "public"."artworks" drop column "royalty" cascade;
