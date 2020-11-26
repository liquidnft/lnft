<script context="module">
	export async function preload({ params }) {
    let { tag } = params;
		return { tag };
	}
</script>

<script>
  export let tag;
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworksByTag } from "$queries/artworks";
  import { Card } from "$comp";

  let artworks = [];
  let getArtworksByTag$ = operationStore(getArtworksByTag(tag));
  subscription(getArtworksByTag$, (a, b) => (artworks = b.artworks));
</script>

<h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">#{tag}</h1>

<div class="flex flex-wrap">
  {#each artworks as artwork (artwork.id)}
    <Card {artwork} />
  {/each}
</div>
