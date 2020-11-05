<script>
  import Artists from "$components/Artists.svelte";
  import Login from "$components/Login.svelte";
  import { secret } from "$components/store";

  let registering = false;
</script>

<div class="text-center">
  {#if !$secret}
      <Login />
    {/if}
  <Artists />
</div>
