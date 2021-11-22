DROP VIEW currentuser CASCADE;
CREATE OR REPLACE VIEW "public"."currentuser" AS 
 SELECT *
   FROM users;
