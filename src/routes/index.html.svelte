<script context="module">
  export async function load({ fetch, page }) {
    const props = await fetch(`/artworks/recent.json`).then((r) => r.json());

    return {
      maxage: 90,
      props,
    };
  }
</script>

<script>
  import Index from "./index.svelte";
  
  export let featured;
  export let recent;
  export let latest;
</script>

<Index {featured} {recent} {latest} />
