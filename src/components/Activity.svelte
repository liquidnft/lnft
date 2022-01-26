<script>
  import { Avatar, Card, TransactionTime, TransactionText } from "$comp";
  import { formatDistanceStrict } from "date-fns";

  export let transaction;
  export let showImage = false;
</script>

<div class="flex mb-6 text-left">
  <Avatar user={transaction.user} />
  <div class="ml-3">
    <TransactionText {transaction} />
    <TransactionTime {transaction} on:accepted />
  </div>
</div>

{#if showImage}
  <div class="mb-24 activity-card">
    <Card artwork={transaction.artwork} columns={2} showDetails={false} />
  </div>
{/if}
