<script>
  import { format } from "date-fns";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { getTransactions } from "$lib/wallet";
  import { asset, transactions, user } from "$lib/store";
  import { assetLabel, val, units } from "$lib/utils";
  import { subscription, operationStore } from "@urql/svelte";
  import { getUserTransactions } from "$queries/transactions";

  let show = false;
  $: if ($user) getTransactions();

  let userTransactions = [];
  subscription(
    operationStore(getUserTransactions($user.id)),
    (a, b) => (userTransactions = b.transactions)
  );

  let value = (tx, a) => {
    let outs = tx.vout.filter(
      (o) => o.asset === a && o.scriptpubkey_address === $user.address
    );
    if (!outs.length) return 0;
    let total = outs.reduce((a, b) => (b.value ? a + b.value : a), 0);
    return val(outs[0].asset, total);
  };

  $: txAssets = (tx) => [
    ...new Set(
      tx.vout.filter((o) => !show || o.asset === $asset).map((o) => o.asset)
    ),
  ];
</script>

<div class="my-7 flex">
  <div class="flex-1">Show all history</div>
  <ToggleSwitch
    id="toggle"
    label={`Show only ${assetLabel($asset)}`}
    on:change={(e) => {(show = !show)}} />
</div>

{#each $transactions as tx}
  {#each txAssets(tx) as a}
    {#if value(tx, a)}
      <div class="w-full mb-4">
        <div class="flex">
          <div class="flex-grow text-sm text-gray-500">
            {tx.status.block_time ? format(new Date(1000 * tx.status.block_time), 'MMM do, yyyy') : 'Pending'}
          </div>
          <div class="text-green-700">+{value(tx, a)}</div>
        </div>

        <div class="">{assetLabel(a)} Deposit</div>
      </div>
    {/if}
  {/each}
{/each}
