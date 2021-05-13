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
  $: columns = 3;

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

<div class="grid gap-10 grid-cols-3" bind:clientWidth={w}>
  {#each artworks as artwork, i (artwork.id)}
    {#if i % offset === 0}
      <div class="col-span-3 w-full flex invisible h-0">
        <h4 class="mx-auto" id={`artwork-${i}`}>{i / offset + 1}</h4>
      </div>
    {/if}
    <div class="market-gallery w-full mb-20">
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
