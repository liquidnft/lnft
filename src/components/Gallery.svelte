<script>
  import { browser } from "$app/env";
  import { Card, Pagination } from "$comp";
  import { onMount, tick } from "svelte";

  export let artworks;
  export let count;

  let inview = artworks.slice(0, 24);
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
    window.scrollTo(0, 0);
    init();
  };

  onMount(() => setTimeout(resize, 50));
  let retry;

  $: browser && init(artworks);
  let init = async () => {
    await tick();
    if (y !== 0) return (retry = setTimeout(init, 50));
    clearTimeout(retry);

    let el = document.querySelector(".market-gallery");
    if (!el) return;

    let { top, bottom } = el.getBoundingClientRect();
    rh = bottom - top;

    newrows = Math.ceil(count / columns);
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
      st = content.offsetTop;
      if (!rh) return;
      cr = Math.round((y - st) / rh);
      let p = 2 * columns;
      a = Math.max(p, cr * columns);
      if (a >= 0) inview = artworks.slice(a - p, a + p);
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
        <Card {artwork} bind:justScrolled />
      </div>
    {/each}
  </div>
</div>
