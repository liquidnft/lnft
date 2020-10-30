<script>
  import TailwindStyles from "./TailwindStyles.svelte";
  import Artists from "./Artists.svelte";
  import Secret from "./Secret.svelte";
  import { secret } from "./store";
</script>

<div class="text-center">
  {#if !$secret}
    <Secret />
  {:else}
    <Artists />
  {/if}
</div>
