<script>
  import { browser } from "$app/env";
  import { Card, Pagination } from "$comp";
  import { onMount, tick } from "svelte";
  import { offset } from "$lib/store";

  export let filtered;
  export let total;
  export let loadMore;

  let current = 0;
  let pageSize = 210;

  $: pages = total > 0 ? [...Array(Math.ceil(total / pageSize)).keys()] : [];

  let load = (page) => {
    current = page;
    $offset = page * pageSize;
    loadMore();
    resize();
  };

  let inview = filtered.slice(0, 24);
  let debug;

  let w, h;
  let hidden;
  let maxPages = 7;
  $: columns = w >= 1024 ? 3 : w >= 640 ? 2 : 1;

  let st;
  let y;

  let content, rh, newrows, nh, viewportHeight;

  let resize = () => {
    if (!browser) return;
    st = undefined;
    init();
  };

  onMount(() => setTimeout(resize, 50));
  let retry;

  $: browser && init(filtered);
  let init = async () => {
    window.scrollTo(0, 0);
    await tick();
    if (y !== 0) return (retry = setTimeout(init, 50));
    clearTimeout(retry);

    let el = document.querySelector(".market-gallery");
    if (!el) return scroll(y);

    let { top, bottom } = el.getBoundingClientRect();
    rh = bottom - top;

    newrows = Math.ceil(filtered.length / columns);
    nh = rh * (newrows + 1) - y;
    content.style.height = `${nh + (columns > 1 ? 200 : 0)}px`;
    scroll(y);
  };

  let a, cr, translate, sf;
  let timeout;
  let justScrolled = true;
  let animationFrame;
  let x;

  $: browser && scroll(y);
  let scroll = (y) => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    animationFrame = window.requestAnimationFrame(() => {
      if (!content) return;
      st = content.offsetTop;
      if (!rh) return;
      cr = Math.round((y - st) / rh);
      let p = 2 * columns;
      a = Math.max(p, cr * columns);
      if (a >= 0) inview = filtered.slice(a - p, a + p);
      x = cr > 1 ? parseInt((8 * rh) / (y - cr * rh)) : 0;

      translate = Math.max(0, cr * rh - rh) + x;
      justScrolled = true;
      setTimeout(() => (justScrolled = false), 250);
    });
  };
</script>

<svelte:window bind:innerWidth={w} bind:scrollY={y} on:resize={resize} />

{#if debug}
  <div class="fixed bg-white z-50 left-2">
    {inview.map((a) => a.id.substr(0, 4))}
    nh
    {nh}<br />
    w
    {w}<br />
    len
    {inview.length}<br />
    a
    {a}<br />
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
    <input bind:value={y} /><br />
    {y && y.toFixed(2)}<br />
    x
    {x && x.toFixed(2)}<br />
  </div>
{/if}

<div bind:this={content} id="content">
  <div class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
    {#each inview as artwork, i}
      <div
        class="market-gallery w-full mb-20"
        style={`transform: translateY(${translate}px)`}
      >
        <Card {artwork} bind:justScrolled height={350} />
      </div>
    {/each}
  </div>
</div>

<div class="full-width flex bg-white p-4 mx-auto">
  <div class="mx-auto">
    {#each pages as _, i}
      <button
        class="rounded-full w-12 h-12"
        class:font-bold={i === current}
        on:click={() => load(i)}>{i + 1}</button
      >
    {/each}
  </div>
</div>

<style>
  .full-width {
    width: 100%;
    left: calc(100vw - 100%);
  }
</style>
