<script context="module">
  export async function load({ fetch, params: { username } }) {
    const r = await fetch(`/artworks/username/${username}.json`).then((r) => r.json());

    return {
      props: {
        count: r.count,
        artworks: r.artworks,
        username
      },
    };
  }

</script>

<script>
  import { query } from "$lib/api";
  import { Gallery } from "$comp";

  export let artworks;
  export let count;
  export let username;
</script>

<div class="container mx-auto mt-10 md:mt-20">
  <h2 class="mb-10">{username}</h2>
  <Gallery filtered={artworks} bind:count />
</div>
