<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getArtworkBySlug } from "$queries/artworks";
  import Artwork from "../artwork/[id].svelte";
  import { hasura } from "$lib/api";
  import { token } from "$lib/store";

  let artwork;

  $: update($page.params.slug, $token);
  let update = async (slug) => {
    if (!slug) return;
    artwork = (
      await hasura
        .auth(`Bearer ${$token}`)
        .post({
          query: getArtworkBySlug($page.params.slug),
        })
        .json()
    ).data.artworks[0];
  };
</script>

{#if artwork}
  <Artwork id={artwork.id} />
{/if}
