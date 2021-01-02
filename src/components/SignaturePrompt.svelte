<script>
  import { psbt, prompt, password, user, snack, token } from "$lib/store";
  import { api } from "$lib/api";
  import Lock from "$icons/lock";
  import { sign, broadcast } from "$lib/wallet";
  import { address as Address, script } from "@asoltys/liquidjs-lib";
  import reverse from "buffer-reverse";

  export let submit = (e) => {
    sign($psbt);
    broadcast($psbt);
    $prompt = undefined;
  };

  let base64 = false;

  export let test = "123";

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

  let outs = [];
  $: outs = $psbt.__CACHE.__TX.outs
    .map((out) => {
      let address;
      try {
        address = Address.fromOutputScript(out.script);
      } catch (e) {
        if (!out.script.length) address = "Fee";
        else return;
      }
      return {
        value: parseInt(out.value.slice(1).toString("hex"), 16),
        asset: reverse(out.asset).toString("hex").substr(0, 6),
        address,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.address === "Fee" ? -1 : a.asset.localeCompare(b.asset)))
    .reverse();
</script>

<svelte:options accessors={true} />

<h1 class="text-xl font-bold">Sign Transaction</h1>
<div class="w-1/4 mx-auto my-4">
  <Lock />
</div>
{#if base64}
  <div class="break-all font-mono text-xs mb-2">{$psbt.toBase64()}</div>
{/if}
{#each outs as out}
  <div class="flex break-all mb-2 text-sm">
    <div class="w-1/6 font-bold">{out.value}</div>
    <div class="mr-2">{out.asset}</div>
    <div class="text-right flex-grow">{out.address}</div>
  </div>
{/each}

<div class="flex">
  <button class="mx-auto my-4 border border-black" on:click={() => copy($psbt.toBase64())}>Copy to Clipboard</button>
</div>
