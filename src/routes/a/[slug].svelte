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
    let h = $token ? hasura.auth(`Bearer ${$token}`) : hasura;

    let result = await h
      .post({
        query: getArtworkBySlug($page.params.slug),
      })
      .json();

    if (result.data) artwork = result.data.artworks[0];
    else console.log(result);
  };
</script>

{#if artwork}
  <Artwork id={artwork.id} />
{/if}
