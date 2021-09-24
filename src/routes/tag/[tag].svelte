<script>
  import { query } from "$lib/api";
  import { page } from "$app/stores";
  import { getArtworksByTag } from "$queries/artworks";
  import Card from "$styleguide/components/Card.svelte";
  import galleries from "$lib/galleries";
  import { err } from "$lib/utils";

  let { tag } = $page.params;
  let artworks = [];
  $: query(getArtworksByTag(tag))
    .then((res) => (artworks = res.artworks))
    .catch(err);
</script>

<div class="container mx-auto mt-10 md:mt-20">
  <h3 class="mb-10">{galleries[tag] ? galleries[tag] : `#${tag}` }</h3>

  <div class="flex flex-wrap">
    {#each artworks as artwork (artwork.id)}
      <div class="w-full md:w-full lg:w-1/2 xl:w-1/2 pr-6 mb-10">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>
