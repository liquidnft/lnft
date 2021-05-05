<script>
  import Card from "$components/Card";
  import { tick } from "svelte";
  import Pagination from "$components/Pagination";
  import LoadingPlaceholder from "$components/LoadingPlaceholder";

  export let artworks;
  export let offset;

  let loaded = {};

  let w;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 1232 ? 4 : 3;

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
  .invisible{
    height: 0;
  }

  .market-gallery :global(.card-link img), .market-gallery :global(.card-link video){
    height: 350px;
  }

  
</style>

<div class="flex flex-wrap" bind:clientWidth={w}>
  {#each artworks as artwork, i (artwork.id)}
    {#if i % offset === 0}
      <div class="w-full flex" class:invisible={i === 0} class:h-0={i === 0}>
        <h4 class="mx-auto mb-12" id={`artwork-${i}`}>{i / offset + 1}</h4>
      </div>
    {/if}
    <div class="market-gallery w-full md:w-1/2 sm:pr-10 lg:w-1/3 xl:w-1/4 mb-20">
      {#if artwork}
        {#if !loaded[artwork.id]}
          <LoadingPlaceholder />
        {/if}
        <div class:invisible={!loaded[artwork.id]}>
          <Card {artwork} bind:loaded={loaded[artwork.id]} />
        </div>
      {/if}
    </div>
  {/each}
</div>

<Pagination {artworks} {hidden} {offset} />
