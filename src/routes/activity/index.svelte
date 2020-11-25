<script>
  import { user } from '$lib/store';
  import Activity from "$components/Activity";

  import { getTransactions } from "$queries/transactions";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  let transactions = [];
  subscription(operationStore(getTransactions), (a, b) => (transactions = b.transactions));
</script>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6 px-6 md:px-12">Activity</h1>
</div>

{#each transactions as transaction}
  <Activity transaction={transaction} />
{/each}
