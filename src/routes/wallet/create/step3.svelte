<script>
  import { err, goto } from "$lib/utils";
  import Seed from "../_seed.svelte";
  import { getMnemonic } from "$lib/wallet";
  import Button from "$styleguide/components/Button";

  let importWallet;
  let mnemonic;

  let checkMnemonic = async () => {
    if (mnemonic !== getMnemonic()) return err("Failed to validate backup phrase, please try again")
    await importWallet(mnemonic);
  }
</script>

<div class="w-full">
  <Seed bind:importWallet bind:mnemonic />

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => goto('/wallet/create/step2')}
      class="w-2/4 m-2 secondary-btn">Back</button>
    <Button primary
            on:click={checkMnemonic}
            class="w-2/4 m-2">Next</Button>
  </div>
</div>
