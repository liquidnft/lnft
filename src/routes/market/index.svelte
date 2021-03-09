<script>
  import { addresses, show, user, results } from "$lib/store";
  import { operationStore, subscription } from "@urql/svelte";
  import { getArtworks } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import Gallery from "$components/Gallery";
  import Results from "$components/Results";
  import Search from "$components/Search";
  import Filter from "./_filter";
  import Sort from "./_sort";


  let artworks = [];
  let filtered = [];

  subscription(
    operationStore(getArtworks),
    (a, b) => (artworks = filtered = b.artworks)
  );

  let showFilters;
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

  .filters {
    display: none;
    cursor: pointer;
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

    .filters {
      display: block;
    }

    .showFilters {
      display: block !important;
    }
  }
</style>

<Results />

<div class="container mx-auto flex flex-wrap sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-10 md:mb-0">Market</h2>

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
        <p
          class="filters mb-8 font-bold"
          on:click={() => (showFilters = !showFilters)}>
          FILTERS
          <i class="fas fa-sliders-h ml-3" />
        </p>
      </div>
      <Sort bind:filtered />
    </div>
    <Filter bind:filtered {artworks} {showFilters} />
  </div>
  <Gallery artworks={filtered} />
</div>
