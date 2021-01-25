<script>
  import { psbt, prompt, password, user, sighash, snack, token } from "$lib/store";
  import Transaction from "$components/Transaction";
  import { api } from "$lib/api";
  import Lock from "$icons/lock";
  import { sign } from "$lib/wallet";
  import { copy, requirePassword } from "$lib/utils";

  export let submit = async (e) => {
    await requirePassword();
    $psbt = sign($psbt, $sighash || 1);
    $prompt = "success";
    $prompt = undefined;
    $sighash = undefined;
  };

  let base64 = false;
</script>

<svelte:options accessors={true} />

<h1 class="text-xl font-bold">Sign Transaction</h1>
<div class="w-1/4 mx-auto my-4">
  <Lock />
</div>
<Transaction summary={true} />
{#if base64}
  <div class="break-all font-mono text-xs mb-2">{$psbt.toBase64()}</div>
{/if}

<div class="flex">
  <button
    class="mx-auto my-4 border border-black"
    on:click={() => copy($psbt.toBase64())}>Copy to Clipboard</button>
</div>
