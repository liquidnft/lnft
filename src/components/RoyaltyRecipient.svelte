<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let askingAsset;
  export let recipient;
  import { tickers, royaltyRecipientIndividualType } from "$lib/utils";
  const onDelete = () => dispatch("removerecipient", recipient.name);

</script>

<style>
  .btn:hover {
    color: rgb(247, 162, 141);
  }

</style>

<div class="flex mb-2">
  <div
    class="py-2 {recipient.type === royaltyRecipientIndividualType ? 'bg-primary' : 'bg-gray-500'} w-3 rounded-l-lg" />
  <div
    class="flex flex-wrap w-full bg-gray-600 text-gray-100 rounded-r-lg p-4 border-white">
    <div class="flex flex-wrap flex-grow">
      <div class="md:w-4/12 w-1/2">{recipient.name}</div>
      <div class="md:w-2/12 w-1/2">
        {`${recipient.amount}% in ${tickers[askingAsset].ticker}`}
      </div>
      <div class="w-full break-all text-wrap text-sm text-gray-400">{recipient.address}</div>
    </div>
    {#if recipient.type === royaltyRecipientIndividualType}
      <div
        class="btn cursor-pointer text-center rounded-sm border text-sm p-2 my-auto"
        on:click|stopPropagation={onDelete}>
        Remove
      </div>
    {/if}
  </div>
</div>
