<script>
  import { onMount } from "svelte";
  import { ToggleSwitch } from "$comp";
  import { artworks, filterCriteria as fc } from "$lib/store";

  export let showFilters;
  export let filtered;

  let temp = filtered.map((x) => {
    return x;
  });

  $: update(
    $fc.listPrice,
    $fc.openBid,
    $fc.ownedByCreator,
    $fc.hasSold,
    $artworks
  );
  let update = () => {
    filtered = temp.filter(filter);
  };
  onMount(update);

  let filter = (a) =>
    (!$fc.listPrice || a.list_price) &&
    (!$fc.openBid || (a.bid && a.bid.amount)) &&
    (!$fc.ownedByCreator || a.artist_id === a.owner_id) &&
    (!$fc.hasSold || a.transferred_at);
</script>

<div class:showFilters class="switch-container w-full md:w-auto">
  <div>
    <ToggleSwitch
      id="list-price"
      label="Has list price"
      checked={$fc.listPrice}
      on:change={(e) => ($fc.listPrice = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="open-bid"
      label="Has open bid"
      checked={$fc.openBid}
      on:change={(e) => ($fc.openBid = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="owned-by-creator"
      label="Owned by creator"
      checked={$fc.ownedByCreator}
      on:change={(e) => ($fc.ownedByCreator = e.target.checked)}
    />
  </div>
  <div>
    <ToggleSwitch
      id="has-sold"
      label="Has sold"
      checked={$fc.hasSold}
      on:change={(e) => ($fc.hasSold = e.target.checked)}
    />
  </div>
</div>

<style>
  .switch-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .switch-container div {
    margin: 0px 20px 20px 0;
  }
  @media only screen and (max-width: 1023px) {
    .switch-container {
      flex-direction: column;
      display: none;
      margin-top: -10px;
    }

    .showFilters {
      display: block !important;
      width: 100%;
    }
  }
</style>
