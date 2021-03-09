<script>
  import { results } from "$lib/store";
  import { go } from "$lib/utils";
</script>

{#if $results.tag || $results.artwork || $results.user}
  <div class="container mx-auto my-10">
    <div class="text-xl font-bold mb-4">You could also be looking for...</div>
    <div class="flex secondary-color cursor-pointer">
      {#each $results.tag || [] as o}
        <div on:click={() => go(o)} class="mr-8 cursor-pointer">#{o.s}</div>
      {/each}

      {#each $results.artwork || [] as o}
        <div on:click={() => go(o)} class="mr-8 cursor-pointer">{o.s}</div>
      {/each}
      {#each $results.user || [] as o}
        <div on:click={() => go(o)} class="mr-8 cursor-pointer">{o.s}</div>
      {/each}
    </div>
  </div>
{/if}
