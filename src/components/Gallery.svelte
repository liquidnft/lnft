<script>
  import Card from "$components/Card";
  import { tick } from "svelte";
  import Pagination from "$components/Pagination";

  export let artworks;
  export let offset;

  let hidden;
  let maxPages = 7;

  $: offset =
    artworks &&
    artworks.length / maxPages - ((artworks.length / maxPages) % 3) + 3;

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

<div class="flex flex-wrap">
  {#each artworks as artwork, i (artwork.id)}
    {#if i % offset === 0}
      <div class="w-full flex" class:invisible={i === 0} class:h-0={i === 0}>
        <h4 class="mx-auto mb-12" id={`artwork-${i}`}>{i / offset + 1}</h4>
      </div>
    {/if}
    <div class="w-full lg:w-1/3 xl:w-1/4 lg:px-5 xl:px-8 mb-20">
      <Card {artwork} />
    </div>
  {/each}
</div>

<Pagination {artworks} {hidden} {offset} />
