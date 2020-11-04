<script>
  import TailwindStyles from "./TailwindStyles.svelte";
  import Artists from "./Artists.svelte";
  import Login from "./Login.svelte";
  import { secret } from "./store";

  let registering = false;
</script>

<div class="text-center">
  {#if !$secret}
      <Login />
    {/if}
  <Artists />
</div>
