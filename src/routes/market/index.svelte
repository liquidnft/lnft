<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { token } from "$lib/store";
  import { getArtworks } from "$queries/artworks";

  let artworks = [];
  onMount(async () => {
    artworks = await getArtworks($token);
  });
</script>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">Market</h1>
</div>

<div class="flex flex-wrap px-6">
  {#each artworks as artwork (artwork.id)}
    <Card {artwork} />
  {/each}
</div>
