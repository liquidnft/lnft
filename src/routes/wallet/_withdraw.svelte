<script>
  import { session } from "$app/stores";
  import { query } from "$lib/api";
  import { tick } from "svelte";
  import { asset, assets, balances, psbt } from "$lib/store";
  import { broadcast, pay, keypair, requestSignature } from "$lib/wallet";
  import { btc, dev, err, info, sats, val, assetLabel } from "$lib/utils";
  import sign from "$lib/sign";
  import { ProgressLinear } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { getArtworkByAsset } from "$queries/artworks";

  export let withdrawing = false;

  let amount;
  let to = dev
    ? "AzppkpkTHBGfGcvU89AKH9JNuoe24LZvjbNCDStpykLLUj2S3n3zPFPVhQCiC8akswapzRrEqHnJUmMQ"
    : "";

  let loading;
  let artwork;

  $: updateAsset($asset);
  let updateAsset = (a) =>
    query(getArtworkByAsset(a))
      .then(({ artworks }) => (artwork = artworks[0]))
      .catch(err);

  $: clearForm($asset);
  let clearForm = () => {
    amount = undefined;
  };

  let send = async (e) => {
    await requirePassword($session);

    loading = true;
    try {
      if ($asset !== btc && !artwork) artwork = { asset: $asset };
      $psbt = await pay(artwork, to.trim(), sats($asset, amount));
      $psbt = await sign();

      if (artwork && (artwork.auction_end || artwork.has_royalty)) {
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

{#if $session.user && withdrawing}
  <form
    class="dark-bg md:rounded-lg p-5 w-full flex flex-col"
    on:submit|preventDefault={send}
    autocomplete="off"
  >
    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="flex flex-col mb-4">
        <label for="asset">Asset</label>
        <select id="asset" class="text-black" bind:value={$asset}>
          {#each $assets as asset}
            <option value={asset.asset}>{assetLabel(asset.asset)}</option>
          {/each}
        </select>
      </div>
      <div class="flex flex-col mb-4">
        <label for="amount">Amount</label>
        <div class="flex justify-between text-black">
          <input
            id="amount"
            class="w-full"
            placeholder={val($asset, 0)}
            bind:value={amount}
          />
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <label for="address">Recipient Address</label>
        <textarea
          id="address"
          style="overflow:auto"
          placeholder="Address"
          bind:value={to}
          rows={4}
        />
      </div>
      <button type="submit" class="primary-btn w-full mt-5"
        >Complete withdraw</button
      >
    {/if}
  </form>
{/if}

<style>
  textarea,
  input,
  select {
    @apply rounded-lg p-2 text-black;
    margin-top: 10px;
  }
</style>
