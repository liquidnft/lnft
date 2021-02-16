<script>
  import Seed from "../_seed.svelte";
  import { password, user } from "$lib/store";
  import { err, goto, info } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { createWallet } from "$lib/wallet";
  import { updateUser } from "$queries/users";
  import { mutation } from "@urql/svelte";

  let mnemonic;
  let update = mutation(updateUser);
  let importWallet = async () => {
    try {
      await update({ id: $user.id, user: createWallet(mnemonic) });
      info("Wallet updated");
      setTimeout(() => goto("/wallet"), 50);
    } catch (e) {
      err(e);
    }
  };
</script>

<div class="w-full">
  <Seed bind:mnemonic />

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => goto('/wallet/create/step2')}
      class="w-2/4 secondary-btn">Back</button>
    <button on:click={importWallet} class="w-2/4 primary-btn">Next</button>
  </div>
</div>
