<script>
  import { painting, variation } from "$lib/store";
  import { Card, Pagination } from "$comp";
  import { onMount, tick } from "svelte";

  export let filtered;
  export let count;

  let loaded = {};
  let debug;

  $: showDetails = $painting && $variation;

  let w;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 1024 ? 3 : w >= 640 ? 2 : 1;

  let st;
  let y;

  let content, rh, newrows, nh, viewportHeight, inview;

  let resize = async () => {
    st = undefined;
    window.scrollTo(0, 0);
    setTimeout(init, 50);
  };

  $: init(filtered);
  let init = async () => {
    inview = filtered.slice(0, 24);
    await tick();

    let el = document.querySelector(".market-gallery");
    if (!el) return;

    let { top, bottom } = el.getBoundingClientRect();
    rh = bottom - top;
    if (!st) st = top;

    newrows = Math.ceil(count / columns);
    nh = rh * (newrows + 1) - y;
    content.style.height = `${nh + (columns > 1 ? 200 : 0)}px`;
  };

  let a, cr, translate, sf;
  let c = 30;
  let timeout;
  let justScrolled;

  $: scroll(y, c);
  let scroll = (y) => {
    window.requestAnimationFrame(() => {
      clearTimeout(timeout);
      if (!st || !rh) return;
      cr = Math.round((y - st) / rh);
      let p = 2 * columns;
      a = Math.max(p, cr * columns);
      if (filtered && a >= 0) inview = filtered.slice(a - p, a + p);
      translate = Math.max(0, cr * rh - rh);
      justScrolled = true;
      setTimeout(() => (justScrolled = false), 250);
    });
  };

</script>

<style>
  .market-gallery :global(.card-link img),
  .market-gallery :global(.card-link video) {
    height: 350px;
  }

</style>

<svelte:window bind:innerWidth={w} bind:scrollY={y} on:resize={resize} />

{#if debug}
  <div class="fixed bg-white z-50 left-2">
    nh
    {nh}<br />
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
      {#if artwork}
        <div
          class="market-gallery w-full mb-20"
          style={`transform: translateY(${translate}px)`}>
          <Card {artwork} bind:justScrolled bind:loaded={loaded[artwork.id]} />
        </div>
      {/if}
    {/each}
  </div>
</div>
