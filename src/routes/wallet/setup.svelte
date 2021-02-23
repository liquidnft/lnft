<script>
  import { goto } from "$lib/utils";
  import { user, wallet } from "$lib/store";
</script>

<style>
  button {
    @apply border mb-2 block mx-auto w-full;
  }
</style>

{#if $user}
<div class="w-full lg:w-3/4">
  <p class="mb-6 text-2xl">Welcome! Choose your option to get started</p>
  <div class="text-center flex flex-col">
    <button on:click={() => goto('/wallet/create')} class="primary-btn m-1">{$user.wallet_initialized ? "Backup" : "Create New"} Wallet</button>
    <button on:click={() => goto('/wallet/import')} class="secondary-btn m-1">Import wallet from seed</button>
  </div>
</div>
{/if}
