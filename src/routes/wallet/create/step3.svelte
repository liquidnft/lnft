<script>
  import Seed from "../_seed.svelte";
  let importWallet;
  let mnemonic;
</script>

<div class="w-full">
  <Seed bind:importWallet bind:mnemonic />

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => goto('/wallet/create/step2')}
      class="w-2/4 m-2 secondary-btn">Back</button>
    <button on:click={() => importWallet(mnemonic)} class="w-2/4 primary-btn m-2">Next</button>
  </div>
</div>
