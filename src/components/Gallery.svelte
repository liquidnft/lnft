<script>
  import Card from "$styleguide/components/Card.svelte";
  import {Pagination, LoadingPlaceholder } from "$comp";
  import { tick } from "svelte";

  export let artworks;
  export let offset;

  let loaded = {};

  let w;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 1024 ? 3 : w >= 640 ? 2 : 1;

  $: offset =
    artworks &&
    artworks.length / maxPages -
      ((artworks.length / maxPages) % columns) +
      columns;

  $: artworks &&
    tick().then(() => {
      let visible = {};
      let observers = {};
      let observe = (s) => {
        let el = document.querySelector(s);
        if (observers[s]) observers[s].unobserve();
        observers[s] = new IntersectionObserver((e) => {
          visible[s] = e[0].isIntersecting;
          hidden = visible[".controls"] || visible[".footer"];
        });
        if (el) observers[s].observe(el);
      };

      observe(".controls");
      observe(".footer");
    });

</script>

<style>
  .invisible {
    height: 0;
  }

  .market-gallery :global(.card-link img),
  .market-gallery :global(.card-link video) {
    height: 350px;
  }

</style>

<div class="grid md:grid-cols-1 md:gap-16 lg:grid-cols-2 lg:gap-16" bind:clientWidth={w}>
  {#each artworks as artwork, i (artwork.id)}
    <!-- display only artworks with list price or auctioned -->
    {#if artwork && (artwork.list_price || (artwork.auction_start && artwork.auction_end))}
      <div class="market-gallery w-full mb-20">
      {#if artwork}
          <Card {artwork} bind:loaded={loaded[artwork.id]} />
      {/if}
      </div>
    {/if}
  {/each}
</div>

<Pagination {artworks} {hidden} {offset} />
