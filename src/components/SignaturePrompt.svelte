<script>
  import { psbt, prompt, password, user, snack, token } from "$lib/store";
  import Transaction from "$components/Transaction";
  import { api } from "$lib/api";
  import Lock from "$icons/lock";
  import { sign } from "$lib/wallet";
  import { requirePassword } from "$lib/utils";

  export let submit = async (e) => {
    await requirePassword();
    $psbt = sign($psbt);
    console.log("after sign", $psbt.toBase64(), $psbt.extractTransaction().getId());
    $prompt = undefined;
  };

  let base64 = false;

  function copy(v) {
    let textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.value = v;

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);

    $snack = "Copied!";
  }

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
