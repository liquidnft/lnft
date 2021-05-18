<script>
  import { page } from "$app/stores";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworksByTag } from "$queries/artworks";
  import { Card } from "$comp";
  import galleries from "$lib/galleries";

  let { tag } = $page.params;
  let artworks = [];
  let getArtworksByTag$ = operationStore(getArtworksByTag(tag));
  subscription(getArtworksByTag$, (a, b) => (artworks = b.artworks));
</script>

<div class="container mx-auto mt-10 md:mt-20">
  <h3 class="mb-10">{galleries[tag] ? galleries[tag] : `#${tag}` }</h3>

  <div class="flex flex-wrap">
    {#each artworks as artwork (artwork.id)}
      <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 pr-6 mb-10">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>
