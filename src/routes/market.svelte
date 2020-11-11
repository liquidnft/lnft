<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";

  import { gql } from "$components/api";
  import { token } from "$components/store";

  let artworks = [];
  onMount(() => {
    let params = {
      query: `query {
        artworks {
          id,
          title
        }
      }`,
    };

    gql
      .auth(`Bearer ${$token}`)
      .post(params)
      .json(({ data }) => (artworks = data.artworks));
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
