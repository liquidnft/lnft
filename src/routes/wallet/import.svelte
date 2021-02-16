<script>
  import Seed from "./_seed.svelte";
  let mnemonic;
  let importWallet;
</script>

<div class="w-full">
  <Seed bind:importWallet bind:mnemonic />

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => importWallet(mnemonic)}
      class="w-2/4 primary-btn">Next</button>
  </div>
</div>
