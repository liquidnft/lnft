<script>
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
  import {
    artworks,
    show,
    user,
    results,
    sortCriteria,
    token,
  } from "$lib/store";
  import { info, err, goto } from "$lib/utils";
  import Gallery from "$components/Gallery";
  import Results from "$components/Results";
  import Search from "$components/Search";
  import Filter from "./_filter";
  import Sort from "./_sort";
  import { requirePassword } from "$lib/auth";
  import { hasura } from "$lib/api";
  import { countArtworks, getArtworks } from "$queries/artworks";

  export let showFilters;
  let filtered = [];

  let count = 0;
  let offset = 0;

  $: reset($sortCriteria);
  let reset = () => {
    $artworks = [];
    offset = 0;
    loadArtworks();
  } 

  const loadArtworks = async () => {
    let order_by = {
      newest: {
        created_at: "asc",
      },
      oldest: {
        created_at: "desc",
      },
      highest: {
        list_price: "desc",
      },
      lowest: {
        list_price: "asc",
      },
      ending_soon: {
        auction_end: "desc",
      },
      most_viewed: {
        views: "desc",
      },
    }[$sortCriteria];

    let result = await hasura
      .auth(`Bearer ${$token}`)
      .post({
        query: getArtworks,
        variables: { limit: 12, offset, order_by },
      })
      .json();

    offset += 12;

    if (result.data) {
      $artworks = [...$artworks, ...result.data.artworks];
    } else {
      err(result.errors[0]);
    }
  };

  onMount(async () => {
    if ($token) {
      let result = await hasura
        .auth(`Bearer ${$token}`)
        .post({
          query: countArtworks,
        })
        .json();

      if (result.data) count = result.data.artworks_aggregate.aggregate.count;
    }

    new IntersectionObserver(async (e) => {
      if (e[0].isIntersecting && $artworks.length < count) loadArtworks();
    }).observe(document.querySelector(".footer"));
  });
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

  @media only screen and (max-width: 1023px) {
    .search :global(input) {
      width: 90%;
      appearance: none;
      border: 0;
      border-bottom: 1px solid #6ed8e0;
    }

    select {
      border: none;
      background-color: white;
      margin-top: -20px;
      text-transform: uppercase;
      font-weight: bold;
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
  <Gallery artworks={filtered} />
</div>
