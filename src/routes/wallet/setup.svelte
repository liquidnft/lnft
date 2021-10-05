<script>
  import { goto } from "$lib/utils";
  import { user, wallet } from "$lib/store";
  import Button from '$styleguide/components/Button.svelte';
</script>

{#if $user}
  <div class="w-full px-5 md:px-0">
    <p class="mb-6 text-2xl">Welcome! Choose your option to get started</p>
    <div class="text-center flex flex-col">
      <a href="/wallet/create" class="m-1">
        <Button primary class="w-full">
          {$user.wallet_initialized ? 'Backup' : 'Create new'} wallet
        </Button>
      </a>
      <a href="/wallet/import" class="secondary-btn m-1">Import wallet from seed</a>
    </div>
  </div>
{/if}
