<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { show, token } from "$lib/store";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworks } from "$queries/artworks";
  import { goto } from "$lib/utils";

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
</script>

<style>
  .switch-container{
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  .filter-container{
    padding-bottom: 30px;
    margin: 1.6%;
    margin-top: 50px;
  }
  .switch-container div{
    margin: 0px 20px 20px 0; 
  }

  .sort-container select{
      margin-top:20px;
  }


  @media only screen and (max-width: 1023px){
    .switch-container{
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 500px){
    .filter-container{
      flex-direction: column-reverse;
    }
    .sort-container{
      margin: 0;
      margin-bottom: 20px;
    }
  }

</style>
<div class="container mx-auto flex justify-between px-8">
  <h1 class="title primary-color">Market</h1>
  <button on:click={() => goto('/artwork/create')}
      class="my-auto text-center brand-color mt-0">Submit a New Artwork</button>
</div>
<div class="container mx-auto">
  <div class="mb-6 px-4 flex filter-container">
    <div class="mt-auto">
      <div class="switch-container">
        <div>
          <ToggleSwitch
            id="list-price"
            label="Has list price"
            on:change={(e) => (listPrice = e.target.checked)} />
        </div>
        <div>
          <ToggleSwitch
            id="open-bid"
            label="Has open bid"
            on:change={(e) => (openBid = e.target.checked)} />
        </div>
        <div>
          <ToggleSwitch
            id="owned-by-creator"
            label="Owned by creator"
            on:change={(e) => (ownedByCreator = e.target.checked)} />
        </div>
        <div>
          <ToggleSwitch
            id="has-sold"
            label="Has sold"
            on:change={(e) => (hasSold = e.target.checked)} />
        </div>
      </div>
    </div>
    <div class="ml-auto sort-container">
      <select class="rounded-full bg-gray-200" bind:value={sort}>
        <option value="active">Recently active</option>
        <option value="lowest">Lowest price</option>
        <option value="highest">Highest price</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  </div>

  <div class="flex flex-wrap">
    {#each filtered as artwork (artwork.id)}
      <div class="w-full md:w-1/2 lg:w-1/3 px-10 mb-20">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>