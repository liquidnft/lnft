<script>
  export let artworks;
  export let offset;
  export let hidden;

  let jump = async (i) => {
    document.getElementById(`artwork-${i * offset}`).scrollIntoView();
  };
</script>

{#if artworks && offset}
  <div class="fixed bottom-0 flex w-full bg-white p-4" class:hidden>
    <div class="mx-auto">
      {#each new Array(Math.ceil(artworks.length / offset)) as _, i}
        <button
          class="rounded-full bg-red w-12 h-12"
          on:click={() => jump(i)}>{i + 1}</button>
      {/each}
    </div>
  </div>
{/if}
