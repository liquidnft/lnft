CREATE EXTENSION pg_trgm;
CREATE TABLE public.artworks (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    artist_id uuid NOT NULL,
    title text NOT NULL,
    owner_id uuid NOT NULL,
    description text,
    filename text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    list_price bigint,
    transferred_at timestamp with time zone,
    asset text,
    auction_end timestamp with time zone,
    list_price_tx text,
    asking_asset text,
    auction_start timestamp with time zone,
    editions integer DEFAULT 1 NOT NULL,
    reserve_price integer,
    ticker text,
    royalty integer,
    max_extensions integer,
    extension_interval integer,
    bid_increment integer
);
CREATE TABLE public.transactions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    hash text NOT NULL,
    artwork_id uuid NOT NULL,
    type text NOT NULL,
    amount integer NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    asset text,
    psbt text,
    confirmed boolean DEFAULT false NOT NULL,
    bid_id uuid
);
CREATE FUNCTION public.artwork_bid(artwork_row public.artworks) RETURNS SETOF public.transactions
    LANGUAGE sql STABLE
    AS $$
    SELECT *
    FROM transactions T
    WHERE T.artwork_id = artwork_row.id
    ORDER BY amount DESC
    LIMIT 1
$$;
CREATE FUNCTION public.artwork_bid2(artwork_row public.artworks) RETURNS public.transactions
    LANGUAGE sql STABLE
    AS $$
    SELECT transactions.*
    FROM transactions
    JOIN artworks ON transactions.artwork_id = artworks.id
    WHERE transactions.artwork_id = artwork_row.id
    AND transactions.type = 'bid'
    AND (transactions.created_at > artworks.transferred_at
    OR artworks.transferred_at IS NULL)
    ORDER BY amount DESC
    LIMIT 1
$$;
CREATE TABLE public.favorites (
    user_id uuid NOT NULL,
    artwork_id uuid NOT NULL
);
CREATE FUNCTION public.artwork_favorited(artwork_row public.artworks, hasura_session json) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
SELECT EXISTS (
    SELECT 1
    FROM favorites F
    WHERE F.user_id = (hasura_session ->> 'x-hasura-user-id')::uuid AND F.artwork_id = artwork_row.id
);
$$;
CREATE FUNCTION public.artwork_favorites(artwork_row public.artworks, hasura_session json) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
    SELECT count(*)
    FROM favorites F
    WHERE F.artwork_id = artwork_row.id
$$;
CREATE FUNCTION public.artwork_last_tx(artwork_row public.artworks) RETURNS timestamp with time zone
    LANGUAGE sql STABLE
    AS $$
    SELECT max(transactions.created_at)
    FROM transactions
    WHERE transactions.artwork_id = artwork_row.id
$$;
CREATE TABLE public.tags (
    artwork_id uuid NOT NULL,
    tag text NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username text NOT NULL,
    avatar_url text,
    display_name text NOT NULL,
    location text,
    bio text,
    website text,
    email text,
    full_name text,
    address_index integer DEFAULT 0 NOT NULL,
    pubkey text,
    mnemonic text,
    address text,
    gaid text,
    amp_mnemonic text,
    confidential text,
    amp_user_id integer
);
CREATE VIEW public.search AS
 SELECT a.id,
    a.title AS s,
    'artwork'::text AS type
   FROM public.artworks a
UNION
 SELECT u.id,
    u.username AS s,
    'user'::text AS type
   FROM public.users u
UNION
 SELECT DISTINCT NULL::uuid AS id,
    t.tag AS s,
    'tag'::text AS type
   FROM public.tags t;
CREATE FUNCTION public.searchable(t text) RETURNS SETOF public.search
    LANGUAGE sql STABLE
    AS $$ 
SELECT   * 
FROM     search 
WHERE    t <% ( s ) 
ORDER BY similarity(t, ( s )) DESC limit 5; 
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  _new record;
begin
  _new := new;
  _new. "updated_at" = now();
  return _new;
end;
$$;
CREATE FUNCTION public.trigger_set_transferred_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.owner_id <> OLD.owner_id THEN
    NEW.list_price = null;
    NEW.list_price_tx = null;
    NEW.auction_start = null;
    NEW.auction_end = null;
    NEW.max_extensions = null;
    NEW.extension_interval = null;
    NEW.reserve_price = null;
    NEW.bid_increment = null;
    NEW.asking_asset = null;
    NEW.transferred_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;
CREATE TABLE public.follows (
    follower_id uuid NOT NULL,
    user_id uuid NOT NULL
);
CREATE FUNCTION public.user_followed(user_row public.users, hasura_session json) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
SELECT EXISTS (
    SELECT 1
    FROM follows F
    WHERE F.follower_id = (hasura_session ->> 'x-hasura-user-id')::uuid AND F.user_id = user_row.id
);
$$;
CREATE FUNCTION public.user_followers(user_row public.users) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
    SELECT count(*)
    FROM follows F
    WHERE F.user_id = user_row.id
$$;
CREATE FUNCTION public.user_follows(user_row public.users) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
    SELECT count(*)
    FROM follows F
    WHERE F.follower_id = user_row.id
$$;
CREATE VIEW public.collectors AS
 SELECT u.id,
    u.created_at,
    u.updated_at,
    u.username,
    u.avatar_url,
    u.display_name,
    u.location,
    u.bio,
    u.website,
    u.email,
    u.full_name,
    ( SELECT count(*) AS count
           FROM public.artworks a
          WHERE (u.id = a.owner_id)) AS num_artworks
   FROM public.users u
  ORDER BY ( SELECT count(*) AS count
           FROM public.artworks a
          WHERE (u.id = a.owner_id)) DESC;
CREATE VIEW public.offers AS
 SELECT t.artwork_id,
    t.amount,
    t.psbt,
    t.id
   FROM (public.transactions t
     JOIN public.artworks a ON (((t.artwork_id = a.id) AND (((t.created_at > a.transferred_at) OR (a.transferred_at IS NULL)) AND (t.type = 'bid'::text)))))
  WHERE (t.amount = ( SELECT max(t2.amount) AS max
           FROM public.transactions t2
          WHERE (t2.artwork_id = t.artwork_id)));
CREATE TABLE public.utxos (
    utxo text NOT NULL,
    user_id uuid NOT NULL
);
ALTER TABLE ONLY public.utxos
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (utxo);
ALTER TABLE ONLY public.artworks
    ADD CONSTRAINT artworks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, artwork_id);
ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (follower_id, user_id);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag, artwork_id);
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_hash_type_key UNIQUE (hash, type);
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE INDEX artworks_title_gin_idx ON public.artworks USING gin (title public.gin_trgm_ops);
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_transferred_at BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.trigger_set_transferred_at();
ALTER TABLE ONLY public.utxos
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.artworks
    ADD CONSTRAINT artworks_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.artworks
    ADD CONSTRAINT artworks_user_id_fkey FOREIGN KEY (artist_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_artwork_id_fkey FOREIGN KEY (artwork_id) REFERENCES public.artworks(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_artwork_id_fkey FOREIGN KEY (artwork_id) REFERENCES public.artworks(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_artwork_id_fkey FOREIGN KEY (artwork_id) REFERENCES public.artworks(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_bid_id_fkey FOREIGN KEY (bid_id) REFERENCES public.transactions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
