<script>
  import { onMount } from "svelte";
  import { ProgressLinear } from "$comp";
  import Fa from "svelte-fa";
  import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
  import {
    artworks,
    filterCriteria,
    results,
    show,
    sortCriteria,
    token,
    user,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import { Gallery, Results, Search } from "$comp";
  import Filter from "./_filter.svelte";
  import Sort from "./_sort.svelte";
  import { requirePassword } from "$lib/auth";
  import { pub } from "$lib/api";
  import { countArtworks, getArtworks } from "$queries/artworks";

  export let showFilters;
  let filtered = [];

  let loading;
  let count = 0;
  let offset = 0;
  let where, order_by;

  $: reset($filterCriteria, $sortCriteria);
  let reset = async () => {
    try {
    where = { _or: [], _and: {is_sold: {_eq: false}} };
    if ($filterCriteria.listPrice)
      where._or.push({ list_price: { _is_null: false } });
    if ($filterCriteria.openBid) where._or.push({ bid: {} });
    if ($filterCriteria.ownedByCreator)
      where._or.push({ artist_owned: { _eq: true } });
    if ($filterCriteria.hasSold)
      where._or.push({ transferred_at: { _is_null: false } });

      if (!where._or.length) delete where._or;

      order_by = {
        newest: {
          created_at: "desc",
        },
        oldest: {
          created_at: "asc",
        },
        highest: {
          list_price: "desc_nulls_last",
        },
        lowest: {
          list_price: "asc_nulls_last",
        },
        ending_soon: {
          auction_end: "asc_nulls_last",
        },
        most_viewed: {
          views: "desc",
        },
      }[$sortCriteria];

      let result = await pub($token)
        .post({
          query: countArtworks,
          variables: { order_by, where },
        })
        .json();

      if (result.data) count = result.data.artworks_aggregate.aggregate.count;
      else err(result.errors[0]);

      $artworks = [];
      offset = 0;
      loadArtworks();
    } catch (e) {
      err(e);
    }
  };

  const loadArtworks = async () => {
    loading = true;

    // await new Promise((r) => setTimeout(r, 500));
    let result = await pub($token)
      .post({
        query: getArtworks($user.id),
        // order_by: [$order_by],
        variables: { limit: 12, offset, where },
      })
      .json();

    offset += 12;

    if (result.data) {
      $artworks = [];

      const bufferArtworks = [
        ...$artworks,
        ...result.data.artworks.filter(
          (a) => !$artworks.find((b) => a.id === b.id) && !a.is_locked
        ),
      ];
      bufferArtworks.forEach(a => {
        if(!$artworks.find(a2 => a2.edition_id === a.edition_id) || !a.hideable) {
          $artworks.push(a);
        }
      })
      console.log($artworks)

    } else {
      err(result.errors[0]);
    }
    loading = false;
  };

  onMount(async () => {
    new IntersectionObserver(async (e) => {
      if (e[0].isIntersecting && $artworks.length < count) loadArtworks();
    }).observe(document.querySelector(".footer"));
  });

</script>

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

<Results />

<div
  class="container mx-auto flex flex-wrap flex-col-reverse md:flex-row sm:justify-between mt-10 md:mt-20">
  <h2 class="md:mb-0">Market</h2>
  {#if $user && $user.is_artist}
    <a href="/artwork/create" class="primary-btn">Submit a new artwork</a>
  {/if}
</div>
<div class="container mx-auto mt-10">
  <div class="flex items-center search">
    <Search />
  </div>
</div>
<div class="container mx-auto">
  <div
    class="flex flex-wrap justify-between items-center md:flex-row-reverse controls">
    <div
      class="w-full lg:w-auto mb-3 flex filter-container justify-between pt-10 xl:py-10 xl:pb-30 mt-50">
      <div class="switch">
        <div
          class="flex cursor-pointer lg:hidden mb-8 font-bold"
          on:click={() => (showFilters = !showFilters)}>
          <div>FILTERS</div>
          <div class="my-auto">
            <Fa icon={faSlidersH} class="ml-3" />
          </div>
        </div>
      </div>
      <Sort bind:filtered />
    </div>
    <Filter bind:filtered {showFilters} />
  </div>
  <Gallery artworks={filtered} {count} />

  {#if loading}
    <ProgressLinear />
  {/if}
</div>
