update artworks a set bid_id = (select id from activebids where type='bid' and artwork_id =  a.id order by amount desc limit 1);
