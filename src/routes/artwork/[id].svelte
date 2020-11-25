<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import { Activity, Amount, Avatar, Card } from "$comp";
  import Sidebar from "./_sidebar";
  import { onMount, tick } from "svelte";
  import { snack, user, token } from "$lib/store";
  import { getArtwork, destroyArtwork } from "$queries/artworks";
  import { createTransaction, getArtworkTransactions } from "$queries/transactions";
  import goto from "$lib/goto";
  import { gql } from "$lib/api";
  import { mutation, subscription, operationStore } from "@urql/svelte";


  export let id;

  let transactions = [];
  subscription(operationStore(getArtworkTransactions(id)), (a, b) => (transactions = b.transactions));

  let result = subscription(operationStore(getArtwork(id)));
  $: artwork = $result.data ? $result.data.artworks_by_pk : null;

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

  let createTransaction$, placeBid;
  $: if (transaction) {
    createTransaction$ = mutation(createTransaction);

    placeBid = (e) => {
      e.preventDefault();
      transaction.artwork_id = artwork.id;
      createTransaction$({ transaction }).then(() => {
        $snack = "Bid placed!";
        bidding = false;
      });
    };
  }

  let destroyArtwork$, destroy;
  $: if (artwork) {
    destroyArtwork$ = mutation(destroyArtwork(artwork));

    destroy = async () => {
      destroyArtwork$().then(() => goto("/market"));
    };
  }
</script>

<style>
  button {
    @apply mb-2 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-green-400;
    }

    &.dangerous {
      &:hover {
        @apply border-red-400;
      }
    }
  }
</style>

{#if artwork}
  <div class="flex flex-wrap">
    <div class="text-center md:text-left w-full md:w-1/4">
      <h1 class="text-3xl font-black text-gray-900">
        {artwork.title || 'Untitled'}
      </h1>
      <div class="font-black mb-6">Edition 1 of 1</div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-green-400 text-xs">#{tag}</a>{' '}
        {/each}
      </div>

      {#if artwork.list_price}<button>Buy Now</button>{/if}
      {#if bidding}
        <form on:submit={placeBid}>
          <Amount bind:this={amount} bind:value={transaction.amount} />
          <button type="submit">Submit</button>
        </form>
      {:else}<button on:click={startBidding}>Place a Bid</button>{/if}
      {#if $user.id === artwork.owner_id}
        <button on:click={destroy} class="dangerous">Destroy</button>
      {/if}
    </div>
    <Card {artwork} link={false} />
    <Sidebar bind:artwork />
  </div>

  {#each transactions as transaction}
    <Activity transaction={transaction} />
  {/each}
{/if}
