<script>
  export let artworks;
  export let offset;
  export let hidden;

  let jump = async (i) => {
    document.getElementById(`artwork-${i * offset}`).scrollIntoView();
  };

  $: pages = [...Array(Math.ceil(artworks.length / offset)).keys()];
  let y;
  /*
  $: current = pages.findIndex((_, i) => {
    return (
      i === pages.length - 1 ||
      (i === 0 &&
        document.getElementById(`artwork-${offset}`) &&
        y < document.getElementById(`artwork-${offset}`).offsetTop) ||
      (document.getElementById(`artwork-${i * offset}`) &&
        y >= document.getElementById(`artwork-${i * offset}`).offsetTop &&
        y < document.getElementById(`artwork-${(i + 1) * offset}`).offsetTop)
    );
  });
   */
  $: current = 0;
</script>

<svelte:window bind:scrollY={y} />

{#if artworks && offset}
  <div class="fixed full-width bottom-0 flex bg-white p-4 mx-auto" class:hidden>
    <div class="mx-auto">
      {#each pages as _, i}
        <button
          class="rounded-full w-12 h-12"
          class:font-bold={i === current}
          on:click={() => jump(i)}>{i + 1}</button
        >
      {/each}
    </div>
  </div>
{/if}

<style>
  .full-width {
    width: 100%;
    left: calc(100vw - 100%);
  }
</style>
