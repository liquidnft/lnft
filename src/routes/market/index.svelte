<script>
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { show, token } from "$lib/store";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworks } from "$queries/artworks";
  import { goto }  from "$app/navigation";

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

<style>
  .switch-container{
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  .filter-container{
    margin-top: 50px;
    border-bottom: 1px solid lightgray;
    padding-bottom: 30px;
    margin: 1.6%;
  }
  .switch-container div{
    margin: 0px 20px 20px 0; 
  }

  .sort-container select{
      margin-top:20px;
  }

  .card-container{
    width: 30%;   
    margin: 1.6%;
  }


  @media only screen and (max-width: 1023px){
    .switch-container{
      flex-direction: column;
    }

    .card-container{
      width: 46%;
    }
  }

  @media only screen and (max-width: 700px){
    .card-container{
      width: 100%;
      margin-bottom: 40px;
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

<h1 class="title">Market</h1>

<div class="flex w-full">
  <button on:click={() => goto('/artwork/create')}
    class="my-auto p-4 text-white text-center mx-auto brand-color">Submit a New Artwork</button>
</div>

<div class="mb-6 flex filter-container">
  <div class="mt-auto">
    <div class="font-bold">Filter by:</div>
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
    <div class="font-bold">Sort by:</div>
    <select bind:value={sort}>
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
    <div class="card-container"><Card {artwork} /></div>
  {/each}
</div>
