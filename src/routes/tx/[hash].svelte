<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { electrs } from "$lib/api";
  import { subscription, operationStore } from "@urql/svelte";
  import { getTransaction } from "$queries/transactions";
  import { Psbt } from "@asoltys/liquidjs-lib";
  import { psbt } from "$lib/store";
  import Transaction from "$components/Transaction";

  const { hash } = $page.params;

  let tx;
  subscription(operationStore(getTransaction(hash)), (a, b) => {
    $psbt = Psbt.fromBase64(b.transactions_by_pk.psbt);
  });

  let explorerUrl;
  if (import.meta && import.meta.env) {
    explorerUrl = import.meta.env.SNOWPACK_PUBLIC_EXPLORER;
  } else {
    explorerUrl = "https://la.coinos.io/explorer";
  }
</script>

<Transaction />
