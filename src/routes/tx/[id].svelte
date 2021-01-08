<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { electrs } from "$lib/api";
  import { subscription, operationStore } from "@urql/svelte";
  import { getTransaction } from "$queries/transactions";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { psbt } from "$lib/store";
  import Transaction from "$components/Transaction";

  const { id } = $page.params;

  let tx;
  subscription(operationStore(getTransaction(id)), (a, b) => {
    let { psbt: p } = b.transactions_by_pk;
    if (p) $psbt = Psbt.fromBase64(p);
    else $psbt = undefined;
  });
</script>

{#if $psbt}
  <Transaction />
{:else}Transaction not found{/if}

<div>
  <button
    class="border my-4"
    on:click={() => window.history.back()}>Back</button>
</div>
