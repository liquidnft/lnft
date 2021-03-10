<script>
  import {differenceInMilliseconds } from "date-fns";
  import { onMount } from "svelte";
  import { sortCriteria } from "$lib/store";
  export let filtered;

  $: update($sortCriteria, filtered);
  let update = () => (filtered = filtered.sort(sort));
  onMount(update);

  let sort = (a, b) =>
    ({
      newest: new Date(b.created_at) - new Date(a.created_at),
      oldest: new Date(a.created_at) - new Date(b.created_at),
      highest: b.list_price - a.list_price,
      lowest: a.list_price - b.list_price,
      ending_soon: !a.auction_end ? 1 : !b.auction_end ? -1 : differenceInMilliseconds(new Date(), new Date(b.auction_end)) - differenceInMilliseconds(new Date(), new Date(a.auction_end)),
      most_viewed: b.views - a.views,
    }[$sortCriteria]);
</script>

<style>
  @media only screen and (max-width: 500px) {
    .sort-container {
      margin: 0;
      margin-bottom: 20px;
    }
    select {
      padding: 0;
      background: none;
    }
  }
</style>

<div class="sort-container">
  <select class="rounded-full bg-gray-100 px-8" bind:value={$sortCriteria}>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="lowest">Lowest price</option>
    <option value="highest">Highest price</option>
    <option value="ending_soon">Ending soon</option>
    <option value="most_viewed">Most viewed</option>
  </select>
</div>
