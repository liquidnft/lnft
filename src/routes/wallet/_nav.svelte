<script>
  import { user } from "$lib/store";
  import { goto } from "$lib/utils";
</script>

<style>

  .nav a:hover{
    color: #3ba5ac;
  }
</style>


{#if $user}
<div class="text-center lg:text-left w-full lg:w-1/4">
  <h1 class="text-4xl font-bold primary-color mb-5"><a href="/wallet">Wallet</a></h1>

  <div class="uppercase font-bold nav flex flex-col">
    <div class="mb-2 mt-5"><a href="/wallet/asset"><i class="fas fa-dollar-sign"></i><span class="ml-3">Change Asset</span></a></div>
    <div class="mb-2 mt-5"><a href="/wallet/settings"><i class="fas fa-cog"></i><span class="ml-3">Wallet Settings</span></a></div>
    <div class="mb-2 mt-5">
      <a href={`/user/${$user.id}`}><i class="fas fa-chevron-left"></i><span class="ml-3">Back to Profile</span></a>
    </div>
  </div>
</div>
{/if}
