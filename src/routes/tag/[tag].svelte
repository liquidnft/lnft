<script>
  import { page } from "$app/stores";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworksByTag } from "$queries/artworks";
  import { Card } from "$comp";

  let { tag } = $page.params;
  let artworks = [];
  let getArtworksByTag$ = operationStore(getArtworksByTag(tag));
  subscription(getArtworksByTag$, (a, b) => (artworks = b.artworks));
</script>

<h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">#{tag}</h1>

<div class="flex flex-wrap">
  {#each artworks as artwork (artwork.id)}
    <div class="w-full lg:w-1/3 pr-6 mb-2">
      <Card {artwork} />
    </div>
  {/each}
</div>
