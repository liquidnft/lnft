<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Card from "$components/Card";
  import { addresses, show, user } from "$lib/store";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworks } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import Search from "$components/Search";
  import { getTags } from "$queries/artworks";

  let tags = [];

  let getTags$ = operationStore(getTags);

  subscription(getTags$, (a, b) => {
    let reduced = [];
    b.tags.map((t) => {
      let i = reduced.find((r) => t.tag === r.tag);
      if (i) i.artworks.push(t.artwork);
      else
        reduced.push({
          tag: t.tag,
          artworks: [t.artwork],
        });
    });
    tags = reduced;
  });

  let filtered = [];
  subscription(operationStore(getArtworks), (a, b) => {
    filtered = b.artworks
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
      );
  });

  let listPrice, openBid, ownedByCreator, hasSold, sort;

  let showFilters = false;
</script>

<style>
  select {
    background: url(down-arrow.png);
    background-repeat: no-repeat;
    background-position: 90%;
    appearance: none !important;
    background-color: whitesmoke;
    padding-right: 3rem;
    background-size: 20px;
  }
  .switch-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .switch-container div {
    margin: 0px 20px 20px 0;
  }

  .filters {
    display: none;
    cursor: pointer;
  }

  @media only screen and (max-width: 1023px) {

    .search :global(input) {
      width: 90%;
      appearance: none;
      border: 0;
      border-bottom: 1px solid #6ED8E0;
    }
   
    .switch-container {
      flex-direction: column;
      display: none;
      margin-top: -10px;
    }

    select {
      border: none;
      background-color: white;
      margin-top: -20px;
      text-transform: uppercase;
      font-weight: bold;
    }

    .filters {
      display: block;
    }

    .showFilters {
      display: block !important;
    }
  }

  @media only screen and (max-width: 500px) {

    .sort-container {
      margin: 0;
      margin-bottom: 20px;
    }
    select{
      padding:0;
      background: none;
    }
  }
</style>

<div
  class="container mx-auto flex flex-wrap sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-10 md:mb-0">Market</h2>

  {#if $user && $user.is_artist}
  <button on:click={() => goto('/artwork/create')} class="primary-btn">Submit a
    New Artwork</button>
{/if}
</div>
<div class="container mx-auto mt-10">
  <div class="flex items-center search">
    <Search />
  </div>
</div>
<div class="container mx-auto">
  <div class="flex flex-wrap justify-between items-center md:flex-row-reverse">
    <div class="w-full lg:w-auto mb-3 flex filter-container justify-between pt-10 xl:py-10 xl:pb-30 mt-50">
      <div class="switch">
        <p
          class="filters mb-8 font-bold"
          on:click={() => (showFilters = !showFilters)}>
          FILTERS
          <i class="fas fa-sliders-h ml-3" />
        </p>
      </div>
      <div class="sort-container">
        <select class="rounded-full bg-gray-100 px-8" bind:value={sort}>
          <option value="active">Recently active</option>
          <option value="lowest">Lowest price</option>
          <option value="highest">Highest price</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
    <div class:showFilters class="switch-container w-full md:w-auto">
      <div>
        <ToggleSwitch
          id="list-price"
          label="Has list price"
          checked={listPrice}
          on:change={(e) => (listPrice = e.target.checked)} />
      </div>
      <div>
        <ToggleSwitch
          id="open-bid"
          label="Has open bid"
          checked={openBid}
          on:change={(e) => (openBid = e.target.checked)} />
      </div>
      <div>
        <ToggleSwitch
          id="owned-by-creator"
          label="Owned by creator"
          checked={ownedByCreator}
          on:change={(e) => (ownedByCreator = e.target.checked)} />
      </div>
      <div>
        <ToggleSwitch
          id="has-sold"
          label="Has sold"
          checked={hasSold}
          on:change={(e) => (hasSold = e.target.checked)} />
      </div>
    </div>
  </div>
   
  

  <div class="flex flex-wrap">
    {#each filtered as artwork (artwork.id)}
      <div class="w-full lg:w-1/3 lg:px-5 xl:px-8 mb-20">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>
