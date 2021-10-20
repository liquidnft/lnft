<script>
  import { Card, Pagination, LoadingPlaceholder } from "$comp";
  import { onMount, tick } from "svelte";

  export let artworks;
  export let offset;

  let loaded = {};

  let w;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 640 ? 3 : w >= 640 ? 2 : 1;

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
  let content, rh, newrows, nh, viewportHeight, inview;
  $: init(artworks);
  let init = async () => {
    count = artworks.length;
    window.scrollTo(0, 0);
    inview = artworks.slice(0, 24);
    await tick();

    let el = document.querySelector(".market-gallery");
    if (!el) return;

    let { top, bottom } = el.getBoundingClientRect();
    rh = bottom - top;
    st = top;

    newrows = count / columns;
    nh = rh * newrows;
    content.style.height = `${nh + (columns > 1 ? 200 : 0)}px`;
  };

  let a, cr;
  $: scroll(y);
  let scroll = (y) => {
    if (!st || !rh) return;
    cr = Math.round((y - st) / rh);
    a = Math.max(0, cr * columns);
    if (artworks && a >= 0) inview = artworks.slice(a, a + 12);
  };

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

<svelte:window bind:innerWidth={w} bind:scrollY={y} on:resize={init} />

{artworks.length}
{count}

<div bind:this={content}>
  <div class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
    {#each inview as artwork, i (artwork.id)}
      {#if i % offset === 0}
        <div class="sm:col-span-2 lg:col-span-3 w-full flex invisible h-0">
          <h4 class="mx-auto" id={`artwork-${i}`}>{i / offset + 1}</h4>
        </div>
      {/if}
      <div
        class="market-gallery w-full mb-20"
        style={`transform: translateY(${Math.max(0, cr * rh)}px)`}>
        {#if artwork}
          <Card {artwork} bind:loaded={loaded[artwork.id]} />
        {/if}
      </div>
    {/if}
    <div class="market-gallery w-full mb-20">
      {#if artwork}
        <Card {artwork} bind:loaded={loaded[artwork.id]} />
      {/if}
    </div>
  {/each}
</div>

<Pagination {artworks} {hidden} {offset} />
