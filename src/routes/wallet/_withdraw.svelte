<script>
  import { tick } from "svelte";
  import { asset, assets, balances, psbt, user } from "$lib/store";
  import { broadcast, pay, keypair, requestSignature } from "$lib/wallet";
  import { btc, err, info, sats, val, assetLabel } from "$lib/utils";
  import sign from "$lib/sign";
  import { ProgressLinear } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { getArtworkByAsset } from "$queries/artworks";
  import { subscription, operationStore } from "@urql/svelte";

  export let withdrawing = false;

  let amount;
  let to;
  let loading;
  let artwork;

  $: updateAsset($asset);
  let updateAsset = (a) =>
    subscription(operationStore(getArtworkByAsset(a)), (a, b) => {
      artwork = b.artworks[0];
    });

  $: clearForm($asset);
  let clearForm = () => {
    amount = 0;
  };

  let send = async (e) => {
    await requirePassword();

    loading = true;
    try {
      if ($asset !== btc && !artwork) artwork = { asset: $asset };
      $psbt = await pay(artwork, to.trim(), sats($asset, amount));
      await sign();

      if (artwork && (artwork.auction_end || artwork.royalty)) {
        $psbt = await requestSignature($psbt);
      }

      await broadcast();

      info("Payment sent!");
      withdrawing = false;
    } catch (e) {
      console.log(e);
      err(e);
    }
    loading = false;
  };
</script>

<style>
  textarea {
    @apply rounded-lg p-2 text-black;
    margin-top: 10px;
  }
</style>

{#if $user && withdrawing}
  <form class="dark-bg md:rounded-lg p-5 w-full flex flex-col" on:submit|preventDefault={send} autocomplete="off">
    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="flex flex-col mb-4">
        <label>Amount</label>
        <div class="flex justify-between text-black">
          <input placeholder={val($asset, 0)} bind:value={amount} />
          <select
            class="rounded-full bg-gray-200 appearance-none py-0 ml-5"
            bind:value={$asset}>
            {#each $assets as asset}
              <option value={asset.asset}>{assetLabel(asset.asset)}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <label>Recipient Address</label>
        <textarea  style="overflow:auto" placeholder="Address" bind:value={to} rows={4} />
      </div>
      <button type="submit" class="primary-btn w-full mt-5">Complete withdraw</button>
    {/if}
  </form>
{/if}
