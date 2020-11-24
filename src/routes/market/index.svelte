<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { show, token } from "$lib/store";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworks } from "$queries/artworks";

  const artworks = operationStore(getArtworks);
  subscription(artworks);

  let listPrice, openBid, ownedByCreator, hasSold, sort;

  $: filtered = $artworks.data
    ? $artworks.data.artworks
        .filter(
          (a) =>
            (!listPrice || a.list_price) &&
            (!openBid || a.bid[0].amount) &&
            (!ownedByCreator || a.artist_id === a.owner_id) &&
            (!hasSold || a.artist_id !== a.owner_id)
        )
        .sort(
          (a, b) =>
            ({
              active:
                new Date(b.last_active) - new Date(a.last_active) ||
                new Date(b.created_at) - new Date(a.created_at),
              lowest: a.list_price - b.list_price,
              highest: b.list_price - a.list_price,
              newest: new Date(b.created_at) - new Date(a.created_at),
              oldest: new Date(a.created_at) - new Date(b.created_at),
            }[sort])
        )
    : [];
</script>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">
    Market
  </h1>
</div>

<div class="ml-12 mb-6 flex">
  <div class="mt-auto">
    <div>Filter by:</div>
    <div>
      <ToggleSwitch
        id="list-price"
        label="Has list price"
        on:change={(e) => (listPrice = e.target.checked)} />
      <ToggleSwitch
        id="open-bid"
        label="Has open bid"
        on:change={(e) => (openBid = e.target.checked)} />
      <ToggleSwitch
        id="owned-by-creator"
        label="Owned by creator"
        on:change={(e) => (ownedByCreator = e.target.checked)} />
      <ToggleSwitch
        id="has-sold"
        label="Has sold"
        on:change={(e) => (hasSold = e.target.checked)} />
    </div>
  </div>
  <div class="ml-auto">
    <div>Sort by:</div>
    <select bind:value={sort}>
      <option value="active">Recently active</option>
      <option value="lowest">Lowest price</option>
      <option value="highest">Highest price</option>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
</div>

<hr class="mb-6" />

<div class="flex flex-wrap px-6">
  {#each filtered as artwork (artwork.id)}
    <Card {artwork} />
  {/each}
</div>

