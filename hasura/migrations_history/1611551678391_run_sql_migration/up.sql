CREATE FUNCTION search_artworks(search text) 
returns setof artworks AS $$ 
SELECT   * 
FROM     artworks 
WHERE    search <% ( title ) 
ORDER BY similarity(search, ( title )) DESC limit 5; 

$$ language sql stable;
