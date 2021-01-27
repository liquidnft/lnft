<script>
  import { formatDistanceStrict } from "date-fns";
  export let transaction;
</script>

<div>
  <span class="font-medium text-gray-600 text-xs">
    {formatDistanceStrict(new Date(transaction.created_at), new Date())}
    ago
  </span>
  <a href={`/tx/${transaction.id}`} class="text-sm secondary-color">
    [view tx]
  </a>
  {#if !transaction.confirmed}
    <span class="text-yellow-500">(pending)</span>
  {/if}
</div>
