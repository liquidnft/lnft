<script>
  import { tick } from "svelte";
  import { asset, prompt, psbt, snack } from "$lib/store";
  import { broadcast, pay, keypair, payment, unblind } from "$lib/wallet";
  import { btc, sats } from "$lib/utils";
  import { SignaturePrompt } from "$comp";

  export let val;

  let amount = 0.0001;
  let fee = 0.00001;
  let to;

  let send = async (e) => {
    e.preventDefault();
    try {
      $psbt = await pay($asset, to, sats($asset, amount), sats(btc, fee));
    } catch (e) {
      $snack = e.message;
      return;
    }
    if (!(await sign())) return;
    await tick();
    await broadcast($psbt);
    $snack = "Payment sent!";
  };

  let sign = async () => {
    $prompt = SignaturePrompt;
    try {
      await new Promise((resolve, reject) =>
        prompt.subscribe((value) => {
          !value && reject();
          value === "success" && resolve();
        })
      );

      return true;
    } catch (e) {
      return false;
    }
  };
</script>

<style>
  input{
    @apply rounded-lg;
  }
</style>

<form class="dark w-full flex flex-col gap-5" on:submit={send} autocomplete="off">
  <div class="flex flex-col mb-4 gap-2">
    <label>Amount</label>
    <div class="flex justify-between">
      <input placeholder={val(0)} bind:value={amount} />
      <select class="rounded-full bg-gray-200">
        <option value="active">L-BTC</option>
      </select>
    </div>
  </div>
  <div class="flex flex-col mb-4 gap-2">
    <label>Fee</label>
    <input placeholder="Fee" bind:value={fee} />
  </div>
  <div class="flex flex-col mb-4 gap-2">
    <label>Recipient Address</label>
    <input placeholder="Address" bind:value={to} />
  </div>
  <button type="submit" class="brand-color w-full">Complete withdraw</button>
</form>
