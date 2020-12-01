<script context="module">
  export async function preload({ params }) {
    let prefix = "http://localhost:3012";
    if (typeof window !== "undefined") {
      prefix = "/electrs";
    }

    let res = await this.fetch(`${prefix}/tx/${params.hash}`);
    let tx = await res.json();
    return { tx };
  }
</script>

<script>
  export let tx;
</script>

{#if tx}
  <div class="font-bold text-xs">Transaction ID</div>
  <div class="mb-4">{tx.txid}</div>
  <div class="font-bold text-xs">Block Time</div>
  <div class="mb-4">{new Date(tx.status.block_time * 1000)}</div>
  <div class="font-bold text-xs">Block Height</div>
  <div class="mb-4">{tx.status.block_height}</div>
  <div class="font-bold text-xs">Size</div>
  <div class="mb-4">{tx.size}</div>
  <div class="font-bold text-xs">Weight</div>
  <div class="mb-4">{tx.weight}</div>

  <div class="font-bold text-xs">JSON</div>
  <div class="font-mono w-1/2 px-12 text-wrap break-all">
    {JSON.stringify(tx)}
  </div>
{/if}
