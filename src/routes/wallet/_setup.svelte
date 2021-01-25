<script>
  import { goto } from "$lib/utils";
  import { user } from "$lib/store";
</script>

<style>
  button {
    @apply border mb-2 block mx-auto w-full;
  }
</style>

<div>
  <p class="mb-4">Welcome! Choose your option to get started</p>
  <div class="text-center">
    <button on:click={() => goto('/wallet/create')}>Create New Wallet</button>
    <button on:click={() => goto('/wallet/import')}>Import wallet from seed</button>
    <button
      on:click={() => {
        $user.wallet = true;
        goto('/wallet');
      }}>View Wallet (for dev)</button>
  </div>
</div>
