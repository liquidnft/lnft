<script context="module">
  export async function load({ fetch }) {
    const r = await fetch("/artworks.json?limit=5000").then((r) => r.json());

    return {
      maxage: 720,
      props: {
        count: Math.min(r.count, 5000),
        initialArtworks: r.artworks,
      },
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { ProgressLinear } from "$comp";
  import Fa from "svelte-fa";
  import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
  import {
    artworks,
    filterCriteria as fc,
    results,
    show,
    sortCriteria as sc,
    token,
    user,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, Search } from "$comp";
  import Filter from "./_filter.svelte";
  import Sort from "./_sort.svelte";
  import { requirePassword } from "$lib/auth";
  import { pub } from "$lib/api";
  import { differenceInMilliseconds } from "date-fns";

  export let count;
  export let showFilters;
  export let initialArtworks;

  $artworks = [...initialArtworks];
  let filtered = $artworks;

  let offset = 0;

  $: reset($fc, $sc);
  let reset = async () => {
    filtered = [...$artworks];
    filtered = filtered.filter(filter).sort(sort);
  };

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
    }[$sc]);

  let filter = (a) =>
    (!$fc.listPrice || a.list_price) &&
    (!$fc.openBid || (a.bid && a.bid.amount)) &&
    (!$fc.ownedByCreator || a.artist_id === a.owner_id) &&
    (!$fc.hasSold || a.transferred_at);

  onMount(async () => {
    const r = await fetch("/artworks.json").then((r) => r.json());
    $artworks = r.artworks;
  });
</script>

<Results />

<div
  class="container mx-auto flex flex-wrap flex-col-reverse md:flex-row sm:justify-between mt-10 md:mt-20"
>
  <h2 class="md:mb-0">Market</h2>
  {#if $user && $user.is_artist}
    <a href="/a/create" class="primary-btn" data-cy="new-artwork"
      >Submit a new artwork</a
    >
  {/if}
</div>
<div class="container mx-auto mt-10">
  <div class="flex items-center search">
    <Search />
  </div>
</div>
<div class="container mx-auto">
  <div
    class="flex flex-wrap justify-between items-center md:flex-row-reverse controls"
  >
    <div
      class="w-full lg:w-auto mb-3 flex filter-container justify-between pt-10 xl:py-10 xl:pb-30 mt-50"
    >
      <div class="switch">
        <div
          class="flex cursor-pointer lg:hidden mb-8 font-bold"
          on:click={() => (showFilters = !showFilters)}
        >
          <div>FILTERS</div>
          <div class="my-auto">
            <Fa icon={faSlidersH} class="ml-3" />
          </div>
        </div>
      </div>
      <Sort />
    </div>
    <Filter {showFilters} />
  </div>
  <Gallery bind:filtered bind:count />
</div>

<style>
  @media only screen and (max-width: 1023px) {
    .search :global(input) {
      width: 90%;
      appearance: none;
      border: 0;
      border-bottom: 1px solid #6ed8e0;
    }
  }

  @media only screen and (max-width: 767px) {
    .primary-btn {
      width: 300px;
      text-align: center;
      margin: 0 auto;
      margin-bottom: 30px;
    }
  }
</style>
