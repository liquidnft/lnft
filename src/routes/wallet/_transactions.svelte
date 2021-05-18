<script>
  import { onMount, onDestroy } from "svelte";
  import { format, parseISO } from "date-fns";
  import { api } from "$lib/api";
  import ToggleSwitch from "$components/ToggleSwitch";
  import { asset, user, token } from "$lib/store";
  import { assetLabel, val, units } from "$lib/utils";
  import { subscription, operationStore } from "@urql/svelte";
  import { getUserTransactions } from "$queries/transactions";

  let show = false;

  let poll;
  onMount(() => {
    poll = setInterval(
      () => $token && api.auth(`Bearer ${$token}`).url("/transactions").get(),
      5000
    );
  });

  onDestroy(() => clearInterval(poll));

  let txns = [];
  $: if ($user) {
    subscription(
      operationStore(getUserTransactions($user.id)),
      (a, b) => (txns = b.transactions)
    );
  }

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
<div class="px-5 sm:px-0">
  {#if txns.length}
    <div class="my-7 flex">
      <div class="flex-1">Show all history</div>
      <ToggleSwitch
        id="toggle"
        label={`Show only ${assetLabel($asset)}`}
        on:change={(e) => {
          show = !show;
        }} />
    </div>

    {#each txns as tx}
      {#if !show || tx.asset === $asset}
        <a href={`/tx/${tx.id}`}>
          <div class="w-full mb-4">
            <div class="flex">
              <div class="flex-grow text-sm text-gray-500">
                {format(parseISO(tx.created_at), 'MMM do, yyyy')}
              </div>
              <div class:text-secondary={tx.amount > 0}>
                {tx.amount > 0 ? '+' : ''}{val(tx.asset, tx.amount)}
              </div>
            </div>

            <div class="">{assetLabel(tx.asset)}</div>
          </div>
        </a>
      {/if}
    {/each}
  {/if}
</div>
