<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { electrs } from "$lib/api";
  import { subscription, operationStore } from "@urql/svelte";
  import { getTransaction } from "$queries/transactions";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { psbt } from "$lib/store";
  import Transaction from "$components/Transaction";
  import { getTx } from "$lib/wallet";

  const { id } = $page.params;

  let tx;
  subscription(operationStore(getTransaction(id)), async (a, b) => {
    let transaction = b.transactions_by_pk;
    let { psbt: p } = transaction;

    if (p) $psbt = Psbt.fromBase64(p);
    else if(!$psbt) {
      tx = await getTx(transaction.hash);
      $psbt = new Psbt();
      tx.ins.map((input) => {
        $psbt.addInput(input);
      });
      tx.outs.map((output) => {
        $psbt.addOutput(output);
      });
    }
  });
</script>

<div class="container mx-auto px-10 mt-16 max-w-xl">
  <div class="mb-5">
    <a on:click={() => window.history.back()} href="/" class="text-midblue"><i
        class="fas fa-chevron-left mr-2" />Back</a>
    <h3 class="py-4">Transaction details</h3>
  </div>
  {#if $psbt}
    <Transaction />
  {:else}Transaction not found{/if}
</div>
