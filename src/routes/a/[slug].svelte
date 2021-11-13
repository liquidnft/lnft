<script context="module">
  export async function load({ fetch, page }) {
    const props = await fetch(`/artworks/${page.params.slug}.json`).then((r) =>
      r.json()
    );

    return {
      maxage: 90,
      props,
    };
  }

</script>

<script>
  import Artwork from "../artwork/[id].svelte";

  export let artwork, transactions, others;
</script>

{#if artwork}
  <Artwork {artwork} {others} {transactions} />
{/if}
