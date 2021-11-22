CREATE OR REPLACE VIEW "public"."currentuser" AS 
 SELECT users.id,
    users.created_at,
    users.updated_at,
    users.display_name,
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
    users.mnemonic,
    users.address,
    users.multisig
   FROM users;
