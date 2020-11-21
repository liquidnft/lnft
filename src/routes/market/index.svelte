<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { token } from "$lib/store";
  import { getArtworks } from "$queries/artworks";
  import ToggleSwitch from "$components/ToggleSwitch";

  let artworks = [];
  onMount(async () => {
    artworks = await getArtworks($token);
  });

  let listPrice, openBid, ownedByCreator, hasSold;

  let filtered = [];
  $: filtered = artworks.filter((a) => (!listPrice || a.list_price) && (!openBid || a.bid[0].amount) && (!ownedByCreator || a.artist_id === a.owner_id) && (!hasSold || a.artist_id !== a.owner_id));
</script>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">Market</h1>
</div>
<div class="ml-12 mb-6 flex">
  <div class="mt-auto">
    <div>Filter by:</div>
    <div>
      <ToggleSwitch
        id="list-price"
        label="Has list price"
        on:change={(e) => (listPrice = e.target.checked)} />
      <ToggleSwitch id="open-bid" label="Has open bid" 
      
        on:change={(e) => (openBid = e.target.checked)}
      />
      <ToggleSwitch id="owned-by-creator" label="Owned by creator" 
        on:change={(e) => (ownedByCreator = e.target.checked)}
      />
      <ToggleSwitch id="has-sold" label="Has sold" 
      
        on:change={(e) => (hasSold = e.target.checked)}
      />
    </div>
  </div>
  <div class="ml-auto">
    <div>Sort by:</div>
    <select>
      <option>Recently active</option>
      <option>Lowest price</option>
      <option>Highest price</option>
      <option>Newest</option>
      <option>Oldest</option>
    </select>
  </div>
</div>

<hr class="mb-6" />

<div class="flex flex-wrap px-6">
  {#each filtered as artwork (artwork.id)}
    <Card {artwork} />
  {/each}
</div>
