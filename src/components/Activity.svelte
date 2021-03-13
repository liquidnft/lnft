<script>
  import Avatar from "$components/Avatar";
  import Card from "$components/Card";
  import TransactionText from "$components/TransactionText";
  import TransactionTime from "$components/TransactionTime";
  import { user } from "$lib/store";
  import { formatDistanceStrict } from "date-fns";

  export let transaction;
  export let showImage = false;
</script>

<style>
  a {
    color: #3ba5ac;
  }

  .divider {
    border: 1px solid #e4e4e4;
    margin: 50px 0;
  }
</style>

<div class="flex mb-4 text-left">
  <Avatar user={transaction.user} key={transaction.user.username} />
  <div class="ml-3">
    <TransactionText {transaction} />
    <TransactionTime {transaction} />
  </div>
</div>

{#if showImage}
  <div class="mb-12">
    <Card
      artwork={transaction.artwork}
      columns={2}
      showDetails={false}
      activityPage={true} />
  </div>
{/if}
