<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import { Amount, Avatar, Card } from "$components/index.js";
  import Sidebar from "./_sidebar";
  import { onMount, tick } from "svelte";
  import { snack, user, token } from "$lib/store";
  import { destroyArtwork, getArtwork } from "$queries/artworks";
  import { createTransaction } from "$queries/transactions";
  import goto from "$lib/goto";
  import { gql } from "$lib/api";

  export let id;

  let artwork;
  onMount(async () => {
    artwork = await getArtwork($token, id);
  });

  let bidding, amount;
  let startBidding = async () => {
    bidding = true;
    await tick();
    amount.focus();
  };

  let transaction = {
    artwork_id: null,
    amount: null,
    hash: "12345",
    type: "bid",
  };

  let placeBid = async () => {
    transaction.artwork_id = artwork.id;
    await createTransaction($token, transaction);
    $snack = "Bid placed!";
    bidding = false;
  };

  let destroy = async () => {
    destroyArtwork($token, artwork).json(() => goto('/'));
  } 
</script>

<style>
  button {
    @apply mb-2 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-teal-400;
    }

    &.dangerous {
      &:hover {
        @apply border-red-400
      } 
    } 
  }
</style>

{#if artwork}
  <div class="flex flex-wrap md:flex-no-wrap">
    <div class="text-center md:text-left w-1/4">
      <h1 class="text-3xl font-black text-gray-900">
        {artwork.title || 'Untitled'}
      </h1>
      <div class="font-black mb-6">Edition 1 of 1</div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-teal-400 text-xs">#{tag}</a>{' '}
        {/each}
      </div>

      {#if artwork.list_price}<button>Buy Now</button>{/if}
      {#if bidding}
        <Amount bind:this={amount} bind:value={transaction.amount} />
        <button on:click={placeBid}>Submit</button>
      {:else}<button on:click={startBidding}>Place a Bid</button>{/if}
      <button on:click={destroy} class="dangerous">Destroy</button>
    </div>
    <Card {artwork} />
    <Sidebar bind:artwork />
  </div>
{/if}
