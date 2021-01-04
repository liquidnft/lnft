<script>
  import { psbt } from "$lib/store";
  import reverse from "buffer-reverse";
  import { address as Address, script } from "@asoltys/liquidjs-lib";

  export let summary = false;

  let explorerUrl;
  if (import.meta && import.meta.env) {
    explorerUrl = import.meta.env.SNOWPACK_PUBLIC_EXPLORER;
  } else {
    explorerUrl = "https://la.coinos.io/explorer";
  }

  let outs = [];
  let tx;

  $: if ($psbt) tx = $psbt.__CACHE.__TX;
  $: if ($psbt)
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
</script>

{#if tx}
  <div class="font-bold text-xs">Transaction ID</div>
  <div class="mb-4 break-all text-wrap">
    <a href={`${explorerUrl}/tx/${tx.getId()}`} class="text-green-400">
      {tx.getId()}
    </a>
  </div>
  <div class="font-bold text-xs">Outputs</div>
    <div class="flex break-all mb-2 text-sm" style="max-width: 500px">
      <div class="w-1/6">Value</div>
      <div class="mr-2">Asset</div>
      <div class="text-right flex-grow">Recipient</div>
    </div>
  {#each outs as out}
    <div class="flex break-all mb-2 text-sm" style="max-width: 500px">
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

    <div class="font-bold text-xs">Hex</div>
    <div class="font-mono w-1/2 text-xs text-wrap break-all">{tx.toHex()}</div>

    <button class="border my-4" on:click={() => window.history.back()}>Back</button>
  {/if}
{/if}
