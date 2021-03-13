<script>
  import { tick } from "svelte";
  import { asset, artworks, assets, balances, psbt, user } from "$lib/store";
  import { broadcast, pay, keypair, requestSignature } from "$lib/wallet";
  import { btc, err, info, sats, val, assetLabel } from "$lib/utils";
  import sign from "$lib/sign";
  import { ProgressLinear } from "$comp";
  import { requirePassword } from "$lib/auth";

  export let withdrawing;

  let amount;
  let to;
  let loading;


  $: clearForm($asset);
  let clearForm = () => {
    amount = undefined;
  };

  let send = async (e) => {
    e.preventDefault();
    await requirePassword();
    loading = true;
    try {
      let artwork = $artworks.find(a => a.asset === $asset);
      $psbt = await pay(artwork, to, sats($asset, amount));
      await sign();

      if (artwork && (artwork.auction_end || artwork.royalty)) {
        $psbt = await requestSignature($psbt);
      } 

      await broadcast();

      $balances[$asset] -= amount;
      info("Payment sent!");
      withdrawing = false;
    } catch (e) {
      err(e);
    }
    loading = false;
  };
</script>

<style>
  input {
    @apply rounded-lg p-2;
    margin-top: 10px;
  }
</style>

{#if $user && withdrawing}
  <form class="dark w-full flex flex-col" on:submit={send} autocomplete="off">
    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="flex flex-col mb-4">
        <label>Amount</label>
        <div class="flex justify-between">
          <input placeholder={val($asset, 0)} bind:value={amount} />
          <select
            class="rounded-full bg-gray-200 appearance-none py-0"
            bind:value={$asset}>
            {#each $assets as asset}
              <option value={asset.asset}>{assetLabel(asset.asset)}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <label>Recipient Address</label>
        <input placeholder="Address" bind:value={to} />
      </div>
      <button type="submit" class="primary-btn w-full mt-5">Complete withdraw</button>
    {/if}
  </form>
{/if}
