<script context="module">
  export async function load({ fetch }) {
    const r = await fetch("/artworks.json?limit=12").then((r) => r.json());

    return {
      maxage: 720,
      props: {
        count: r.count,
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

  export let count;
  export let showFilters;
  export let initialArtworks;

  let filtered = initialArtworks;

  let offset = 0;

  $: reset($filterCriteria, $sortCriteria);
  let reset = async () => {
    if (initialArtworks && initialArtworks.length) {
      $artworks = initialArtworks;
    }
  };

  onMount(async () => {
    const r = await fetch("/artworks.json").then((r) => r.json());
    $artworks = r.artworks;
  });

</script>

<style>
  @media only screen and (max-width: 1023px) {
    .search :global(input) {
      width: 90%;
      appearance: none;
      border: 0;
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
  <Gallery artworks={filtered} bind:count />
</div>
