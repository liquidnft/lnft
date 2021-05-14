<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getArtworkBySlug } from "$queries/artworks";
  import { operationStore, query } from "@urql/svelte";
  import Artwork from "../artwork/[id].svelte";

  const requestPolicy = "cache-and-network";

  let artwork, a, unsubscribe;

  $: update($page.params.slug);
  let update = (slug) => {
    artwork = undefined;

    unsubscribe && unsubscribe();
    unsubscribe = query(operationStore(getArtworkBySlug(slug), {}, { requestPolicy })).subscribe(
      ({ data }) => data && (artwork = data.artworks[0])
    );
  };
</script>

{#if artwork}
  <Artwork id={artwork.id} />
{/if}
