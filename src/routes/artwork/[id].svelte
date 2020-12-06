<script context="module">
  export async function preload({ params }) {
    return params;
  }
</script>

<script>
  import { Activity, Amount, Avatar, Card } from "$comp";
  import Sidebar from "./_sidebar";
  import { onMount, tick } from "svelte";
  import { snack, user, token } from "$lib/store";
  import countdown from "$lib/countdown";
  import { getArtwork, destroyArtwork } from "$queries/artworks";
  import {
    createTransaction,
    getArtworkTransactions,
  } from "$queries/transactions";
  import goto from "$lib/goto";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  export let id;

  let transactions = [];
  subscription(
    operationStore(getArtworkTransactions(id)),
    (a, b) => (transactions = b.transactions)
  );

  let result = subscription(operationStore(getArtwork(id)));
  let artwork;
  let counter;
  $: {
    artwork = $result.data ? $result.data.artworks_by_pk : null;

    let count = () => {
      if (artwork) counter = countdown(new Date(artwork.auction_end));
      setTimeout(count, 1000);
    };
    count();
  }

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
  $: if (artwork) {
    createTransaction$ = mutation(createTransaction);

    placeBid = (e) => {
      if (e) e.preventDefault();
      transaction.artwork_id = artwork.id;
      if (artwork.list_price && transaction.amount >= artwork.list_price) {
        transaction.type = "purchase";
      }
      createTransaction$({ transaction }).then(() => {
        $snack = "Bid placed!";
        bidding = false;
      });
    };
  }

  let buyNow = () => {
    transaction.amount = artwork.list_price;
    transaction.type = "purchase";
    placeBid();
  };

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

{#if $user && artwork}
  <div class="flex flex-wrap">
    <div class="text-center lg:text-left w-full lg:w-1/4">
      <h1 class="text-3xl font-black text-gray-900">
        {artwork.title || 'Untitled'}
      </h1>
      <div class="font-black mb-6">Edition 1 of 1</div>
      <div class="text-sm text-gray-600 break-all">
        Asset Id:
        {artwork.asset}
      </div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-green-400 text-xs">#{tag}</a>{' '}
        {/each}
      </div>

      {#if artwork.list_price}<button on:click={buyNow}>Buy Now</button>{/if}
      {#if $user.id === artwork.owner_id}
        <button
          on:click={() => goto(`/artwork/${id}/edit`)}
          class="dangerous">Edit</button>
        <button on:click={destroy} class="dangerous">Destroy</button>
      {:else if bidding}
        <form on:submit={placeBid}>
          <Amount bind:this={amount} bind:value={transaction.amount} />
          <button type="submit">Submit</button>
        </form>
      {:else}<button on:click={startBidding}>Place a Bid</button>{/if}
        <div class="my-2 font-bold"><span class="font-thin text-sm">Auction closes in</span> <span class="text-2xl">{counter}</span></div>
      <div>
        {#if artwork.list_price}
          <div class="1/2 flex-1">
            <div class="w-1/2 text-sm font-medium">
              List Price
              {artwork.list_price}
              BTC
            </div>
          </div>
        {/if}
        {#if artwork.bid[0].amount}
          <div class="text-sm font-medium">
            Current bid
            {artwork.bid[0].amount}
            BTC
          </div>
        {/if}
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:px-12">
      <Card {artwork} link={false} columns={1} showDetails={false} />
    </div>
    <Sidebar bind:artwork />
  </div>

  {#each transactions as transaction}
    <Activity {transaction} />
  {/each}
{/if}
