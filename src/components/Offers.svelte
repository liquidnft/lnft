<script>
  import goto from "$lib/goto";
  import { onMount } from "svelte";
  import Card from "$components/Card";
  import { token } from "$lib/store";
  import { getTransactions } from "$queries/transactions";

  let transactions = [];
  onMount(async () => {
    transactions = await getTransactions($token);
  });
</script>

<style>
  button {
    @apply border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply border-teal-400;
    }

    &.dangerous {
      &:hover {
        @apply border-red-400;
      }
    }
  }
</style>

<div class="flex flex-wrap px-6">
  {#each transactions as transaction}
    <div class="p-4 w-full flex">
      <div class="my-auto mx-2 w-1/4 text-lg" on:click={() => goto(`/artwork/${transaction.artwork.id}`)}>
        <div class="text-center">{transaction.artwork.title}</div>
        <img
          src={`/api/storage/o/public/${transaction.artwork.filename}`}
          alt={transaction.artwork.title}
          class="h-20 w-20 mx-auto" />
      </div>
      <div class="my-auto mx-2 whitespace-no-wrap w-1/4 tex">
        {transaction.bid}
        BTC
      </div>
      <div class="w-1/2 my-auto"><button>Accept</button></div>
    </div>
  {/each}
</div>
