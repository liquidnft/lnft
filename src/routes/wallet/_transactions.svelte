<script>
  import ToggleSwitch from "$components/ToggleSwitch";
  import { getTransactions } from "$lib/wallet";
  import { asset, transactions, user } from "$lib/store";
  import { val, units, ticker } from "$lib/utils";

  let show = false;
  $: if ($user) getTransactions();
</script>

<div class="my-7 flex">
  <div class="flex-1">Show all history</div>
  <ToggleSwitch
    id="toggle"
    label={`Show only ${asset}`}
    on:change={(e) => (show = e.target.checked)} />
</div>

{#each $transactions as tx}
  <div class="w-full mb-4">
    <div class="flex">
      <div class="flex-grow text-sm text-gray-500">Jan 13th, 2021</div>
      <div class="text-green-700">+{val($asset, tx.vout.reduce((a, b) => b.value ? a + b.value : a, 0))}</div>
    </div>

    <div class="">{ticker($asset)} Deposit</div>
  </div>
{/each}
