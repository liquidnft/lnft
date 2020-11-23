<script>
  import { token } from "$lib/store";
  import {
    operationStore,
    subscription,
  } from "@urql/svelte";

  let limit = 2;
  let offset = 0;
  const artworks = operationStore(
    `
    subscription ($offset: Int!, $limit: Int!) {
      artworks(limit: $limit, offset: $offset) {
        id
        title
      }
    }
  `,
    { limit, offset }
  );

  subscription(artworks);
</script>

<button on:click={() => $artworks.variables.limit++}>More</button>
<button on:click={() => $artworks.variables.limit--}>Less</button>

<button
  on:click={() => ($artworks.variables.offset += $artworks.variables.limit)}>Next</button>
<button
  on:click={() => ($artworks.variables.offset -= $artworks.variables.limit)}>Prev</button>

{#if !$artworks.data}
  <p>Loading...</p>
{:else}
  <ul>
    {#each $artworks.data.artworks as artwork}
      <li>{artwork.title}</li>
    {/each}
  </ul>
{/if}
