<script>
  import { prompt, psbt, snack } from "$lib/store";
  export let asset;
  export let val;

  let amount = 0.0001;
  let fee = 0.00001;
  let to;

  let send = async (e) => {
    e.preventDefault();
    try {
      $psbt = await pay(asset, to, sats(asset, amount), sats(btc, fee));
    } catch (e) {
      $snack = e.message;
      return;
    }
    if (!(await sign())) return;
    await broadcast($psbt);
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
      await tick();

      return true;
    } catch (e) {
      return false;
    }
  };
</script>

<form class="dark w-full" on:submit={send} autocomplete="off">
  <div class="flex flex-col mb-4">
    <label>Amount</label>
    <input placeholder={val(0)} bind:value={amount} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Fee</label>
    <input placeholder="Fee" bind:value={fee} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Recipient Address</label>
    <input placeholder="Address" bind:value={to} />
  </div>
  <button type="submit">Send</button>
</form>
