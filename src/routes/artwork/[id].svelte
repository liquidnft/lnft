<script>
  import { page } from "$app/stores";
  import { Activity, Avatar, Card, SignaturePrompt } from "$comp";
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
  import { units } from "$lib/utils";
  import { Psbt } from "@asoltys/liquidjs-lib";

  let { id } = $page.params;

  let transactions = [];
  subscription(
    operationStore(getArtworkTransactions(id)),
    (a, b) => (transactions = b.transactions)
  );

  let artwork, start_counter, end_counter;
  let createTransaction$ = mutation(createTransaction);

  let list_price;
  let val, sats, ticker;
  let amount;

  $: [sats, val, ticker] = units(artwork && artwork.asking_asset);

  $: if (artwork) {
    list_price = artwork.list_price;
    list_price = val(artwork.list_price);
  }

  $: transaction.amount = sats(amount);

  let makeOffer = async (e) => {
    if (e) e.preventDefault();
    await requirePassword();

    try {
      $psbt = await createOffer(artwork, transaction.amount);
    } catch (e) {
      $snack = e.message;
      return;
    }

    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value === "success" && resolve())
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
      console.log(artwork.list_price, transaction.amount);
      transaction.type = "purchase";
    }
    createTransaction$({ transaction }).then(() => {
      if (transaction.type === "purchase") $snack = "Sold! Congratulations!";
      if (transaction.type === "bid") $snack = "Bid placed!";
      bidding = false;
    });
  };

  let bidding, amountInput;
  let startBidding = async () => {
    bidding = true;
    await tick();
    amountInput.focus();
  };

  let transaction = {
    artwork_id: null,
    amount: null,
    type: "bid",
    hash: "",
  };

  let buyNow = async () => {
    await requirePassword();

    transaction.amount = artwork.list_price;
    transaction.type = "purchase";
    $psbt = await executeSwap(Psbt.fromBase64(artwork.list_price_tx));
    $prompt = SignaturePrompt;

    try {
      await new Promise((resolve, reject) =>
        prompt.subscribe((value) =>
          value === "success" ? resolve() : reject()
        )
      );
    } catch (e) {
      return;
    }

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
        <a
          href={`${explorer}/asset/${artwork.asset}`}
          class="text-green-400">{artwork.asset}</a>
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
        <button on:click={() => goto(`/artwork/${id}/auction`)}>List</button>
        <button on:click={() => goto(`/artwork/${id}/edit`)}>Edit</button>
        <button on:click={destroy} class="dangerous">Destroy</button>
      {:else if artwork.asking_asset}
        {#if artwork.list_price}<button on:click={buyNow}>Buy Now</button>{/if}
        {#if bidding}
          <form on:submit={makeOffer}>
            <div class="flex flex-col mb-4">
              <div>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="price"
                    class="form-input block w-full pl-7"
                    placeholder={val(0)}
                    bind:value={amount}
                    bind:this={amountInput} />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center mr-2">
                    {ticker}
                  </div>
                </div>
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        {:else}<button on:click={startBidding}>Make an Offer</button>{/if}
      {/if}
      <div class="flex my-2 font-bold">
        {#if Date.parse(artwork.auction_start) > new Date()}
          <div class="mt-auto font-thin text-sm">Auction starts in</div>
          <div class="text-right flex-1 text-2xl">{start_counter}</div>
        {/if}
      </div>
      <div class="flex my-2 font-bold">
        {#if Date.parse(artwork.auction_end) > new Date()}
          <div class="mt-auto font-thin text-sm">Auction closes in</div>
          <div class="text-right flex-1 text-2xl">{end_counter}</div>
        {:else if artwork.auction_end}
          <div class="mt-auto font-thin text-sm">Auction ended at</div>
          <div class="text-right flex-1 text-2xl">{artwork.auction_end}</div>
        {/if}
      </div>
      <div>
        {#if artwork.list_price}
          <div class="flex flex-1 font-bold my-2">
            <div class="font-thin text-sm mt-auto">List Price</div>
            <div class="text-right flex-1 text-2xl">{list_price} {ticker}</div>
          </div>
        {/if}
        {#if artwork.reserve_price}
          <div class="flex flex-1 font-bold my-2">
            <div class="font-thin text-sm mt-auto">Reserve Price</div>
            <div class="text-right flex-1 text-2xl">
              {artwork.reserve_price}
              {ticker}
            </div>
          </div>
        {/if}
        {#if artwork.bid[0].amount}
          <div class="flex flex-1 font-bold my-2">
            <div class="font-thin text-sm mt-auto">Current bid</div>
            <div class="text-right flex-1 text-2xl">
              {val(artwork.bid[0].amount)}
              {ticker}
            </div>
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
