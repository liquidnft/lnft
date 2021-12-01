<script context="module">
  import { serverApi } from "$lib/api";

  export async function load({ fetch, page }) {
    const props = await fetch(`/artworks/${page.params.slug}.json`).then((r) =>
      r.json()
    );

    serverApi.url("/viewed").post({ id: props.artwork.id }).json().catch(console.log);

    return {
      maxage: 90,
      props,
    };
  }
</script>

<script>
  import Artwork from "../artwork/[id].svelte";

  export let artwork, others;
</script>

{#if artwork}
  <Artwork {artwork} {others} />
{/if}
