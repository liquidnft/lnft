<script>
  import { psbt } from "$lib/store";
  import Check from "$icons/check";
  import reverse from "buffer-reverse";
  import { address as Address, script } from "@asoltys/liquidjs-lib";
  import { electrs } from "$lib/api";
  import { explorer } from "$lib/utils";

  export let summary = false;

  let ins = [];
  let outs = [];
  let tx;

  $: init($psbt);
  let init = async (p) => {
    if (!p) return;

    try {
      tx = p.extractTransaction();
    } catch (e) {
      tx = p.__CACHE.__TX;
    }

    for (let i = 0; i < tx.ins.length; i++) {
      let { hash, index } = tx.ins[i];
      let txid = reverse(hash).toString("hex");
      let input = (await electrs.url(`/tx/${txid}`).get().json()).vout[index];
      input.asset = input.asset.substr(0, 6);
      input.signed = p.data.inputs[i] && !!p.data.inputs[i].finalScriptWitness;

      ins = [...ins, input];
    }

    outs = tx.outs
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
      .sort((a, b) =>
        a.address === "Fee" ? -1 : a.asset.localeCompare(b.asset)
      )
      .reverse();
  };
</script>

{#if tx}
  <div class="w-full mx-auto" style="max-width: 600px">
  <div class="font-bold text-xs">Transaction ID</div>
  <div class="mb-4 break-all text-wrap">
    <a href={`${explorer}/tx/${tx.getId()}`} class="text-green-400">
      {tx.getId()}
    </a>
  </div>
  <div class="font-bold text-xs">Inputs</div>
  <div class="flex break-all mb-2 text-sm">
    <div class="w-1/6">Value</div>
    <div class="mr-2">Asset</div>
  </div>
  {#each ins as input}
    <div class="flex break-all mb-2 text-sm">
      <div class="w-1/6">{input.value}</div>
      <div class="mr-2">{input.asset}</div>
      <div class="text-right flex-grow">{#if input.signed}<div class="ml-auto" style="max-width: 20px"><Check /></div>{/if}</div>
    </div>
  {/each}
  <div class="font-bold text-xs">Outputs</div>
  <div class="flex break-all mb-2 text-sm">
    <div class="w-1/6">Value</div>
    <div class="mr-2">Asset</div>
    <div class="text-right flex-grow">Recipient</div>
  </div>
  {#each outs as out}
    <div class="flex break-all mb-2 text-sm">
      <div class="w-1/6">{out.value}</div>
      <div class="mr-2">{out.asset}</div>
      <div class="text-right flex-grow">{out.address}</div>
    </div>
  {/each}
  {#if !summary}
    <div class="font-bold text-xs">Size</div>
    <div class="mb-4">{tx.virtualSize()}</div>
    <div class="font-bold text-xs">Weight</div>
    <div class="mb-4">{tx.weight()}</div>

    <div class="font-bold text-xs">Tx Hex</div>
    <div class="font-mono w-full text-xs text-wrap break-all mb-4">{tx.toHex()}</div>

    <div class="font-bold text-xs">PSBT Base64</div>
    <div class="font-mono w-full text-xs text-wrap break-all">{$psbt.toBase64()}</div>
  {/if}
</div>
{/if}
