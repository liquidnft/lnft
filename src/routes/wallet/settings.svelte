<script>
  import { page } from "$app/stores";
  import { user } from "$lib/store";
  import { getMnemonic } from "$lib/wallet";
  import { copy } from "$lib/utils";
  import { requirePassword } from "$lib/auth";

  let show;
  let mnemonic;
  let displayMnemonic = async () => {
    await requirePassword();
    show = !show;
    mnemonic = getMnemonic();
  };
</script>

<style>
  button {
    @apply border my-2;
  }
</style>

<h3>Wallet Settings</h3>

<button on:click={displayMnemonic} class="secondary-btn">Display Mnemonic</button>

{#if show}
  <div class="text-xl">{mnemonic}</div>
  <button on:click={() => copy(mnemonic)}>Copy</button>
{/if}
