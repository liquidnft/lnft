<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/stores";
  import reverse from "buffer-reverse";
  import { Buffer } from "buffer";
  import { onMount } from "svelte";
  import { electrs } from "$lib/api";
  import { query, operationStore } from "@urql/svelte";
  import { getTransaction } from "$queries/transactions";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { psbt } from "$lib/store";
  import Transaction from "$components/Transaction";
  import { getTx } from "$lib/wallet";

  const { id } = $page.params;

  let tx;
  let done;

  query(operationStore(getTransaction(id))).subscribe(async ({ data }) => {
    if (done || !data) return;
    let transaction = data.transactions_by_pk;
    let { psbt: p } = transaction;

    if (p) $psbt = Psbt.fromBase64(p);
    else if (!$psbt) {
      tx = await getTx(transaction.hash);
      p = new Psbt();

      for (let i = 0; i < tx.ins.length; i++) {
        p.addInput(tx.ins[i]);
      }

      tx.outs.map((output) => {
        p.addOutput(output);
      });

      $psbt = p;
    }

    done = true;
  });
</script>

<div class="container mx-auto px-10 mt-16 max-w-4xl">
  <div class="mb-5">
    <a
      on:click|preventDefault={() => window.history.back()}
      href="#"
      class="text-midblue">
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back</div>
      </div>
    </a>
    <h3 class="py-4">Transaction details</h3>
  </div>
  {#if $psbt}
    <Transaction {tx} />
  {:else}Transaction not found{/if}
</div>
