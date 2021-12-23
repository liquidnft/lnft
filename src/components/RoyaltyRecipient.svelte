<script>
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  const dispatch = createEventDispatcher();
  export let recipient;
  export let editable = true;
  import { tickers, royaltyRecipientIndividualType } from "$lib/utils";
  const onDelete = () => dispatch("removerecipient", recipient.name);
</script>

<div class="flex mb-2">
  <div
    class="py-2 {recipient.type === royaltyRecipientIndividualType
      ? 'bg-primary'
      : 'bg-gray-500'} w-3 rounded-l-lg"
  />
  <div
    class="flex flex-wrap w-full bg-gray-600 text-gray-100 rounded-r-lg p-4 border-white"
  >
    <div class="flex flex-wrap flex-grow">
      <div>{recipient.name}</div>
      <div class="ml-auto my-auto">
        {recipient.amount}%
      </div>
      <div class="w-full break-all text-wrap text-xs text-secondary">
        {recipient.address}
      </div>
    </div>
    {#if editable && recipient.type === royaltyRecipientIndividualType}
      <div
        class="btn cursor-pointer text-center rounded-sm text-sm p-2 my-auto ml-2"
        on:click|stopPropagation={onDelete}
      >
        <Fa icon={faTimes} />
      </div>
    {/if}
  </div>
</div>

<style>
  .btn:hover {
    color: rgb(247, 162, 141);
  }
</style>
