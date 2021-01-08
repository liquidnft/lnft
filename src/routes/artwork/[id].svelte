<script>
  import { page } from "$app/stores";
  import { Activity, Amount, Avatar, Card, SignaturePrompt } from "$comp";
  import Sidebar from "./_sidebar";
  import { onMount, tick } from "svelte";
  import { prompt, password, snack, user, token, psbt } from "$lib/store";
  import countdown from "$lib/countdown";
  import { getArtwork, destroyArtwork } from "$queries/artworks";
  import {
    createTransaction,
    getArtworkTransactions,
  } from "$queries/transactions";
  import { goto } from "$lib/utils";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { explorer, requireLogin, requirePassword } from "$lib/utils";
  import { createOffer, executeSwap, broadcast } from "$lib/wallet";
  import { tickers } from "$lib/utils";

  let { id } = $page.params;

  let transactions = [];
  subscription(
    operationStore(getArtworkTransactions(id)),
    (a, b) => (transactions = b.transactions)
  );

  let artwork, start_counter, end_counter;
  let createTransaction$ = mutation(createTransaction);

  let makeOffer = async (e) => {
    if (e) e.preventDefault();
    await requirePassword();

    try {
      $psbt = await createOffer(artwork, transaction.amount);
    } catch(e) {
      $snack = e.message;
      throw e;
    } 

    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value || resolve())
    );
    transaction.psbt = $psbt.toBase64();
    save();
  };

  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = b.artworks_by_pk;

    let count = () => {
      start_counter = countdown(new Date(artwork.auction_start));
      end_counter = countdown(new Date(artwork.auction_end));
      setTimeout(count, 1000);
    };
    count();
  });

  let save = (e) => {
    transaction.artwork_id = artwork.id;
    transaction.asset = artwork.asking_asset;
    if (artwork.list_price && transaction.amount >= artwork.list_price) {
      transaction.type = "purchase";
    }
    createTransaction$({ transaction }).then(() => {
      $snack = "Bid placed!";
      bidding = false;
    });
  };

  let bidding, amount;
  let startBidding = async () => {
    bidding = true;
    await tick();
    amount.focus();
  };

  let transaction = {
    artwork_id: null,
    amount: null,
    type: "bid",
    hash: "",
  };

  let buyNow = async () => {
    if (!(await requireLogin())) return false;
    await requirePassword();

    transaction.amount = artwork.list_price;
    transaction.type = "purchase";
    $psbt = await executeSwap(Psbt.fromBase64(artwork.list_price_tx));
    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value || resolve())
    );
    await broadcast($psbt);
    let tx = $psbt.extractTransaction();
    transaction.hash = tx.getId();
    transaction.psbt = $psbt.toBase64();
    save();
  };

  let target;
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

  .card-container {
    padding: 0 100px;
  }

  @media only screen and (max-width: 1023px) {
    .card-container {
      padding: 0;
      margin: 40px 0;
    }
  }
</style>

{#if artwork}
  <div class="flex flex-wrap" bind:this={target}>
    <div class="text-center lg:text-left w-full lg:w-1/4">
      <h1 class="text-3xl font-black text-gray-900">
        {artwork.title || 'Untitled'}
      </h1>
      <div class="font-black mb-6">{artwork.editions} Editions</div>
      <div class="text-sm text-gray-600 break-all">
        Asset Id:
        <a href={`${explorer}/asset/${artwork.asset}`} class="text-green-400">{artwork.asset}</a>
      </div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-green-400 text-xs">#{tag}</a>{' '}
        {/each}
      </div>

        {#if $user && $user.id === artwork.owner_id}
          <button
            on:click={() => goto(`/artwork/${id}/auction`)}>List</button>
          <button on:click={() => goto(`/artwork/${id}/edit`)}>Edit</button>
          <button on:click={destroy} class="dangerous">Destroy</button>
        {:else if artwork.asking_asset}
          {#if artwork.list_price}
            <button on:click={buyNow}>Buy Now</button>
          {/if}
          {#if bidding}
            <form on:submit={makeOffer}>
              <Amount bind:this={amount} bind:value={transaction.amount} />
              <button type="submit">Submit</button>
            </form>
          {:else}<button on:click={startBidding}>Make an Offer</button>{/if}
        {/if}
        <div class="my-2 font-bold">
          {#if Date.parse(artwork.auction_start) > new Date()}
            <span class="font-thin text-sm">Auction starts in</span>
            <span class="text-2xl">{start_counter}</span>
          {/if}
        </div>
        <div class="my-2 font-bold">
          {#if Date.parse(artwork.auction_end) > new Date()}
            <span class="font-thin text-sm">Auction closes in</span>
            <span class="text-2xl">{end_counter}</span>
          {:else if artwork.auction_end}<span class="text-2xl">Auction ended at {artwork.auction_end}</span>{/if}
        </div>
        <div class="my-4">
          {#if artwork.list_price}
            <div class="1/2 flex-1">
              <div class="w-1/2 text-sm font-medium">
                List Price
                {artwork.list_price}
                {tickers[artwork.asking_asset]}
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
    <div class="w-full lg:w-1/2 lg:px-12 card-container">
      <Card {artwork} link={false} columns={1} showDetails={false} />
    </div>
    <Sidebar bind:artwork />
  </div>

  {#each transactions as transaction}
    <Activity {transaction} />
  {/each}
{/if}
