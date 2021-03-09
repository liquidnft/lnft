<script>
  export let artworks;
  export let offset;
  export let hidden;

  let jump = async (i) => {
    document.getElementById(`artwork-${i * offset}`).scrollIntoView();
  };
</script>

<style>
  .full-width {
    width: 100%;
    left: calc(100vw - 100%);
  }
</style>

{#if artworks && offset}
  <div class="fixed full-width bottom-0 flex bg-white p-4 mx-auto" class:hidden>
    <div class="mx-auto">
      {#each new Array(Math.ceil(artworks.length / offset)) as _, i}
        <button
          class="rounded-full bg-red w-12 h-12"
          on:click={() => jump(i)}>{i + 1}</button>
      {/each}
    </div>
  </div>
{/if}
