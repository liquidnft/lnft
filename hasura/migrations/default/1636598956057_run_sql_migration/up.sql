create view designs as SELECT * from artworks where regexp_replace(title, '^.* ', '')::int % 100 = 0;
