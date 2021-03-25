<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getArtworkBySlug } from "$queries/artworks";
  import { getUserByUsername } from "$queries/users";
  import { operationStore, query } from "@urql/svelte";
  import Artwork from "./artwork/[id].svelte";
  import User from "./user/[id].svelte";

  const requestPolicy = "cache-and-network";

  let artwork, user, a, u, una, unu;

  $: update($page.params.slug);
  let update = (slug) => {
    artwork = undefined;
    user = undefined;

    una && una();
    a = operationStore(getArtworkBySlug(slug));
    una = query(a, {}, { requestPolicy }).subscribe(
      ({ data }) => data && (artwork = data.artworks[0])
    );

    unu && unu();
    u = operationStore(getUserByUsername(slug));
    unu = query(u, {}, { requestPolicy }).subscribe(
      ({ data }) => data && (user = data.users[0])
    );
  };
</script>

{#if artwork}
  <Artwork id={artwork.id} />
{:else if user}
  <User subject={user} />
{/if}
