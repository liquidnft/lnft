<script>
  import {
    psbt,
    prompt,
    password,
    user,
    sighash,
    snack,
    token,
  } from "$lib/store";
  import { Transaction } from "$comp";
  import { api } from "$lib/api";
  import Lock from "$icons/lock";
  import { sign } from "$lib/wallet";
  import { copy, err } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import Fa from "svelte-fa";
  import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

  export let submit = async (e) => {
    await requirePassword();

    try {
      $psbt = sign($psbt, $sighash || 1);
      $prompt = "success";
    } catch (e) {
      err(e);
    }

    $prompt = undefined;
    $sighash = undefined;
  };

  let base64 = false;

</script>

<svelte:options accessors={true} />
<div class="flex justify-between">
  <h1 class="font-black text-4xl primary-color">Sign transaction</h1>
  <Fa icon={faTimesCircle} size="2x" />
</div>
<div class="flex my-6">
  <div class="w-1/3 flex flex-col">
    <span class="text-sm mb-2">Artwork title</span>
    <span>Myartwork</span>
  </div>
  <div class="w-2/3 flex flex-col">
    <span class="text-sm mb-2">Number of issues</span>
    <span>5</span>
  </div>
</div>
<div class="text-sm">Transaction fee: 1000 sats</div>
<div class="flex justify-between items-center my-6">
  <span class="secondary-color">View details</span>
  <button class="secondary-btn" on:click={() => copy($psbt.toBase64())}>Copy
    transaction</button>
</div>
<hr class="mb-4" />

<Transaction summary={true} />
{#if base64}
  <div class="break-all font-mono text-xs mb-2">{$psbt.toBase64()}</div>
{/if}
