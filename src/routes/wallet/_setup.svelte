<script>
  import { goto } from "$lib/utils";
  import { wallet } from "$lib/store";
</script>

<style>
  button {
    @apply border mb-2 block mx-auto w-full;
  }
</style>

<div class="w-3/4">
  <p class="mb-6 text-2xl">Welcome! Choose your option to get started</p>
  <div class="text-center flex flex-col gap-2">
    <button on:click={() => goto('/wallet/create')} class="primary-btn">Create New Wallet</button>
    <button on:click={() => goto('/wallet/import')} class="secondary-btn">Import wallet from seed</button>
    <button
      on:click={() => {
        $wallet = true;
        goto('/wallet');
      }} class="secondary-btn">View Wallet (for dev)</button>
  </div>
</div>
