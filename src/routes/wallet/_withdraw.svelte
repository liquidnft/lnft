<script>
  import { asset, psbt, user } from "$lib/store";
  import { broadcast, pay, keypair } from "$lib/wallet";
  import { btc, info, sats } from "$lib/utils";
  import sign from "$lib/sign";

  export let val;
  export let withdrawing;

  let amount = 0.0001;
  let fee = 0.00001;
  let to;

  let send = async (e) => {
    e.preventDefault();
    try {
      $psbt = await pay($asset, to, sats($asset, amount), sats(btc, fee));
    } catch (e) {
      err(e);
      return;
    }
    await sign();
    await broadcast($psbt);
    info("Payment sent!");
  };
</script>

<style>
  input {
    @apply rounded-lg p-2;
    margin-top: 10px;
  }
</style>

{#if $user && withdrawing}
  <form
    class="dark w-full flex flex-col"
    on:submit={send}
    autocomplete="off">
    <div class="flex flex-col mb-4">
      <label>Amount</label>
      <div class="flex justify-between">
        <input placeholder={val(0)} bind:value={amount} />
        <select class="rounded-full bg-gray-200 appearance-none py-0">
          <option value="active">L-BTC</option>
        </select>
      </div>
    </div>
    <div class="flex flex-col mb-4">
      <label>Fee</label>
      <input placeholder="Fee" bind:value={fee} />
    </div>
    <div class="flex flex-col mb-4">
      <label>Recipient Address</label>
      <input placeholder="Address" bind:value={to} />
    </div>
    <button type="submit" class="primary-btn w-full mt-5">Complete withdraw</button>
  </form>
{/if}
