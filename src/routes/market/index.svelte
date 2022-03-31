<script context="module">
  import { post } from "$lib/api";
  export async function load({ fetch }) {
    const r = await post("/artworks.json", {}, fetch).json();

    return {
      props: {
        total: r.total,
        initialArtworks: r.artworks,
      },
    };
  }
</script>

<script>
  import { session } from "$app/stores";
  import { ProgressLinear } from "$comp";
  import Fa from "svelte-fa";
  import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
  import {
    artworks,
    filterCriteria as fc,
    offset,
    results,
    show,
    sortCriteria as sc,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, Search } from "$comp";
  import Filter from "./_filter.svelte";
  import Sort from "./_sort.svelte";
  import { requirePassword } from "$lib/auth";
  import { compareAsc, differenceInMilliseconds, parseISO } from "date-fns";
  import { browser } from "$app/env";

  export let total;
  export let initialArtworks = [];

  let showFilters;
  let filtered = [...initialArtworks];

  $: filtersUpdated($fc, $sc);
  let filtersUpdated = () => {
    $offset = 0;
    loadMore();
  };

  let loadMore = async () => {
    if (!browser) return;
    try {
      let where = {};
      if ($sc === "ending_soon")
        where.auction_end = { _is_null: false, _gte: new Date() };
      if ($fc.listPrice || ["lowest", "highest"].includes($sc)) {
        $fc.listPrice = true;
        where.list_price = { _is_null: false, _gt: 0 };
      }
      if ($fc.openBid) where.bid_id = { _is_null: false };
      if ($fc.ownedByCreator) where.artist_owned = { _eq: true };
      if ($fc.hasSold) where.transferred_at = { _is_null: false };
      if ($fc.isPhysical) where.is_physical = { _eq: true };
      if ($fc.hasRoyalties) where.has_royalty = { _eq: true };

      let order_by = {
        newest: { created_at: "desc" },
        oldest: { created_at: "asc" },
        highest: { list_price: "desc" },
        lowest: { list_price: "asc" },
        ending_soon: { auction_end: "asc" },
        most_viewed: { views: "desc" },
      }[$sc];

      const r = await post(
        "/artworks.json",
        { offset: $offset, order_by, where },
        fetch
      ).json();

      filtered = [...r.artworks];
      total = r.total;
    } catch (e) {
      console.log(e);
    }
  };
</script>

<Results />

<div
  class="container mx-auto flex flex-wrap flex-col-reverse md:flex-row sm:justify-between mt-10 md:mt-20"
>
  <h2 class="md:mb-0">Market</h2>
  {#if $session.user && $session.user.is_artist}
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
    class="flex flex-wrap justify-between items-center flex-row-reverse controls py-10"
  >
    <div class="w-full flex filter-container justify-between">
      <div class="switch">
        <div
          class="flex cursor-pointer font-bold"
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
  <Gallery bind:filtered bind:total bind:loadMore />
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
