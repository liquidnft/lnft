<script>
  import { differenceInMilliseconds } from "date-fns";
  import { onMount } from "svelte";
  import { artworks, sortCriteria } from "$lib/store";
  export let filtered = undefined;

  $: update($sortCriteria);
  let update = () => (filtered = filtered.sort(sort));
  onMount(update);

  let sort = (a, b) =>
    ({
      newest: new Date(b.created_at) - new Date(a.created_at),
      oldest: new Date(a.created_at) - new Date(b.created_at),
      highest: b.list_price - a.list_price,
      lowest: a.list_price - b.list_price,
      ending_soon: !a.auction_end
        ? 1
        : !b.auction_end
        ? -1
        : differenceInMilliseconds(new Date(), new Date(b.auction_end)) -
          differenceInMilliseconds(new Date(), new Date(a.auction_end)),
      most_viewed: b.views - a.views,
    }[$sortCriteria]);

</script>

<style>
  select {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC");
    background-repeat: no-repeat;
    background-position: 90%;
  }
  @media only screen and (max-width: 1023px) {
    .sort-container {
      margin: 0;
      margin-bottom: 20px;
    }
    select {
      padding: 10px 40px 10px 20px;
      border: none;
      margin-top: -20px;
      text-transform: uppercase;
      font-weight: bold;
    }
  }

</style>

<div class="sort-container">
  <select
    class="rounded-full appearance-none bg-gray-100 px-8"
    bind:value={$sortCriteria}>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="lowest">Lowest price</option>
    <option value="highest">Highest price</option>
    <option value="ending_soon">Ending soon</option>
    <option value="most_viewed">Most viewed</option>
  </select>
</div>
