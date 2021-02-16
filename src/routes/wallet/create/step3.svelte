<script>
  import Seed from "../_seed.svelte";
  import { goto } from "$lib/utils";
</script>

<div class="w-full">
  <Seed />

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => goto('/wallet/create/step2')}
      class="w-2/4 secondary-btn">Back</button>
    <button
      on:click={() => goto('/wallet')}
      class="w-2/4 primary-btn">Next</button>
  </div>
</div>
