<script>
  import { Card, Pagination, LoadingPlaceholder } from "$comp";
  import { tick } from "svelte";

  export let artworks;
  export let offset;
  export let count;

  let loaded = {};

  let w, h;
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

  let st;
  let y;

  let n = 0;
  let content;
  let increase = () => {
    console.log("st", content.getBoundingClientRect().top);
    n = n + 100;
    // content.style.height = `${h + n}px`;
    let rows = 12 / columns;
    console.log("rows", rows, h, st);
    let rh = h / rows;
    let newrows = count / columns;
    console.log("nr", newrows, rh, columns, count);
    let nh = rh * newrows;
    console.log("nh", nh);

    content.style.height = `${nh}px`;
  };

  let { log } = console;
  $: log(y);

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

<svelte:window bind:scrollY={y} />
{count}

<button on:click={increase}>Increase height</button>

<div bind:clientHeight={h} bind:this={content}>
  <div
    class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3"
    bind:clientWidth={w}>
    {#each artworks as artwork, i (artwork.id)}
      {#if i % offset === 0}
        <div class="sm:col-span-2 lg:col-span-3 w-full flex invisible h-0">
          <h4 class="mx-auto" id={`artwork-${i}`}>{i / offset + 1}</h4>
        </div>
      {/if}
      <div class="market-gallery w-full mb-20">
        {#if artwork}
          <Card {artwork} bind:loaded={loaded[artwork.id]} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<Pagination {artworks} {hidden} {offset} />
