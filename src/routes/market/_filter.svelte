<script>
  import { onMount } from "svelte";
  import { ToggleSwitch } from "$comp";
  import { artworks, filterCriteria as fc } from "$lib/store";

  export let showFilters;
  export let filtered;

  $: update($fc.listPrice, $fc.openBid, $fc.ownedByCreator, $fc.hasSold, $artworks);
  let update = () => (filtered = $artworks.filter(filter));
  onMount(update);

  let filter = (a) =>
    (!$fc.listPrice || a.list_price) &&
    (!$fc.openBid || a.bid.amount) &&
    (!$fc.ownedByCreator || a.artist_id === a.owner_id) &&
    (!$fc.hasSold || a.transferred_at);
</script>

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

