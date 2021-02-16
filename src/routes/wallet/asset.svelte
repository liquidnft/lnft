<script>
  import { goto } from "$lib/utils";
  import { page } from "$app/stores";
  import { asset, assets, balances, user } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { requireLogin } from "$lib/auth";
  import { getBalances } from "$lib/wallet";
  import { val } from "$lib/utils";

  $: if ($user) getBalances();
  $: requireLogin($page);
</script>

<div class="container mx-auto">
  <div class="mb-5">
    <a href="/wallet" class="text-midblue"><i
        class="fas fa-chevron-left mr-2" />
      Back</a>
  </div>
  <div class="bg-black p-4 rounded-lg">
    {#each $assets as a}
      <div
        class="flex mb-2 cursor-pointer"
        on:click={() => {
          $asset = a.asset;
          goto('/wallet');
        }}>
        <div class={`${a.color} py-2 w-3 bg-lightblue rounded-l-lg`} />
        <div class="flex bg-gray-600 text-white rounded-r-lg p-4 flex-grow">
          <div class="flex-grow">{a.name}</div>
          <div>{val(a.asset, $balances[a.asset])}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
