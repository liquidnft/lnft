<script>
  import { asset, assets, balances, psbt, user } from "$lib/store";
  import { broadcast, pay, keypair } from "$lib/wallet";
  import { btc, info, sats, val, assetLabel } from "$lib/utils";
  import sign from "$lib/sign";
  import { ProgressLinear } from "$comp";

  export let withdrawing;

  let amount = 0.0001;
  let fee = 0.00001;
  let to;
  let loading;

  $: clearForm($asset);
  let clearForm = () => {
    amount = undefined;
  };

  let send = async (e) => {
    e.preventDefault();
    loading = true;
    try {
      $psbt = await pay($asset, to, sats($asset, amount), sats(btc, fee));
      await sign();
      await broadcast($psbt);
      info("Payment sent!");
      withdrawing = false;
    } catch (e) {
      err(e);
      return;
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
      <div class="flex flex-col mb-4 relative">
        <label>Fee</label>
        <input placeholder={val(btc, 0)} bind:value={fee} />
        <div class="absolute inset-y-0 right-0 top-8 flex items-center mr-2">
          {assetLabel(btc)}
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
