<script>
  import { Card, Pagination } from "$comp";
  import { onMount, tick } from "svelte";

  export let artworks;

  let loaded = {};
  let debug;

  let w;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 1024 ? 3 : w >= 640 ? 2 : 1;

  let st;
  let y;

  let content, rh, newrows, nh, viewportHeight, inview;
  $: init(artworks);
  let init = async () => {
    window.scrollTo(0, 0);
    inview = artworks.slice(0, 24);
    await tick();

    if (y > 0) return setTimeout(() => init(artworks), 50);

    let el = document.querySelector(".market-gallery");
    if (!el) return;

    let { top, bottom } = el.getBoundingClientRect();
    rh = bottom - top;
    st = top;

    newrows = artworks.length / columns;
    nh = rh * (newrows + 1);
    content.style.height = `${nh + (columns > 1 ? 200 : 0)}px`;
  };

  let a, cr, translate, sf;
  let c = 30;
  let timeout;

  $: scroll(y, c);
  let scroll = (y) => {
    window.requestAnimationFrame(() => {
      clearTimeout(timeout);
      if (!st || !rh) return;
      cr = Math.round((y - st) / rh);
      let p = 2 * columns;
      a = Math.max(p, cr * columns);
      if (artworks && a >= 0) inview = artworks.slice(a - p, a + p);
      translate = Math.max(0, cr * rh - rh);
    });
  };

</script>

<style>
  .market-gallery :global(.card-link img),
  .market-gallery :global(.card-link video) {
    height: 350px;
  }

</style>

<svelte:window bind:innerWidth={w} bind:scrollY={y} on:resize={init} />

{#if debug}
  <div class="fixed bg-white z-50 left-2">
    w
    {w}<br />
    len
    {inview.length}<br />
    a
    {a}<br />
    c
    <input bind:value={c} /><br />
    translate
    <input bind:value={translate} /><br />
    st
    {st}<br />
    rh
    {rh}<br />
    cr
    {cr}<br />
    cr*rh
    {cr * rh}<br />
    sf
    {sf && sf.toFixed(2)}<br />
    y
    {y && y.toFixed(2)}<br />
  </div>
{/if}

<div bind:this={content}>
  <div class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
    {#each inview as artwork, i}
      <div
        class="market-gallery w-full mb-20"
        style={`transform: translateY(${translate}px)`}>
          <Card {artwork} bind:loaded={loaded[artwork.id]} />
      </div>
    {/if}
    <div class="market-gallery w-full mb-20">
      {#if artwork}
        <Card {artwork} bind:loaded={loaded[artwork.id]} />
      {/if}
    </div>
  {/each}
</div>

