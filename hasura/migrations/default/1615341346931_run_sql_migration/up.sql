CREATE OR REPLACE VIEW "public"."users_public" AS 
 SELECT users.id,
    users.avatar_url,
    users.username,
    users.location,
    users.bio,
    users.website,
    users.email,
    users.full_name,
    users.pubkey,
    users.instagram,
    users.twitter,
    users.address,
    users.multisig
   FROM users;
