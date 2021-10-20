<script>
  import { Card, Pagination, LoadingPlaceholder } from "$comp";
  import { onMount, tick } from "svelte";

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

  let st;
  let y;

  let n = 0;
  let content, rows, rh, newrows, nh, viewportHeight, inview;
  $: init(artworks);
  let init = () => (inview = artworks.slice(0, 6));

  $: increase(inview);
  let increase = () => {
    console.log("al", artworks.length);
    console.log("inview", inview);
    if (!content) return;
    st = content.getBoundingClientRect().top;
    console.log("st", st);
    n = n + 100;
    // content.style.height = `${h + n}px`;
    rows = 12 / columns;
    console.log("count", count);
    console.log("rows", rows);
    rh = 690;
    newrows = count / columns;
    console.log("nr", newrows, rh, columns, count);
    nh = rh * newrows;
    console.log("nh", nh);

    content.style.height = `${nh}px`;
  };

  let cr;
  let { log } = console;
  $: scroll(y);
  let scroll = (y) => {
    if (!st || !rh) return;
    cr = Math.round((y - st) / rh);
    let a = Math.max(0, cr * columns);
    console.log("y", y, st, rh, a, cr, cr * rh);
    if (artworks && parseInt(a)) inview = artworks.slice(a, a + 6);
  };


  let gob = 0;
  let shift = () => (gob += 100); 
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

<button on:click={shift}>SHIFT</button>

{JSON.stringify(artworks.length)}

<div bind:this={content}>
  <div
    class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3"
    bind:clientWidth={w}>
    {#each inview as artwork, i (artwork.id)}
      {#if i % offset === 0}
        <div class="sm:col-span-2 lg:col-span-3 w-full flex invisible h-0">
          <h4 class="mx-auto" id={`artwork-${i}`}>{i / offset + 1}</h4>
        </div>
      {/if}
      <div class="market-gallery w-full mb-20" style={`transform: translateY(${cr * rh}px)`}>
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
