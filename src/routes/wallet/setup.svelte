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
<div class="w-full px-5 md:px-0">
  <p class="mb-6 text-2xl">Welcome! Choose your option to get started</p>
  <div class="text-center flex flex-col">
    <a href="/wallet/create" class="primary-btn m-1">Backup wallet seed</a>
    <a href="/wallet/import" class="secondary-btn m-1">Import wallet from seed</a>
  </div>
</div>
{/if}
