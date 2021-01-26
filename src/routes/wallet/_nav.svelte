<script>
  import { user } from "$lib/store";
  import { goto } from "$lib/utils";
</script>


{#if $user}
<div>
  <h1 class="text-4xl"><a href="/wallet">Wallet</a></h1>

  <div class="uppercase font-bold">
    <div class="mb-2 mt-5"><a href="/wallet/asset">Change Asset</a></div>
    <div class="mb-2 mt-5"><a href="/wallet/settings">Wallet Settings</a></div>
    <div class="mb-2 mt-5">
      <a href={`/user/${$user.id}`}>Back to Profile</a>
    </div>
  </div>
</div>
{/if}
