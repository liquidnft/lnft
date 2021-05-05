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

  .activity-card :global(img), .activity-card :global(video){
   object-fit: cover !important;
   height: 400px;
   width: 500px !important;
   box-shadow: 0 1px 3px rgb(0 0 0 / 18%);
   border-radius: 10px;
  }
</style>

<div class="flex mb-6 text-left">
  <Avatar user={transaction.user} />
  <div class="ml-3">
    <TransactionText {transaction} />
    <TransactionTime {transaction} />
  </div>
</div>

{#if showImage}
  <div class="mb-14 activity-card">
    <Card
      artwork={transaction.artwork}
      columns={2}
      showDetails={false}
      activityPage={true} />
  </div>
{/if}
