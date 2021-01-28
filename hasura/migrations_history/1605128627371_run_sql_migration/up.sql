CREATE TYPE artwork AS (
    id uuid,
artist_id uuid,
title text,
owner_id uuid,
description text,
filename text,
created_at timestamp
);

-- 'hasura_session' will be the session argument
CREATE OR REPLACE FUNCTION artwork_liked_by_user(artwork_row artwork, hasura_session json)
RETURNS boolean AS $$
SELECT EXISTS (
    SELECT 1
    FROM favorites F
    WHERE F.user_id = (hasura_session ->> 'x-hasura-user-id')::uuid AND F.artwork_id = artwork_row.id
);
$$ LANGUAGE sql STABLE;
