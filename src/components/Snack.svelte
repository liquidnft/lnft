<script>
  import { snack } from "$lib/store";

  let info, error;
  let receivedSnack = (s) => {
    if (!s) return;
    let { type } = s;

    info = type === "info";
    error = type === "error";

    setTimeout(() => ($snack = null), 5000);
  };

  $: receivedSnack($snack);
</script>

<style>
  .snack-container {
    @apply fixed z-20 mt-6;
    width: 300px;
    left: 50%;
    margin-left: -150px;
  }

  .snack {
    @apply border-2 px-4 py-3 rounded relative mb-4 mx-auto text-center font-bold;
  }

  .snack.info {
    @apply border-green-400;
  }

  .snack.error {
    @apply border-red-400;
  }
</style>

{#if $snack}
  <div class="snack-container">
    <div class="snack mx-0 w-full" class:info class:error>{$snack.msg}</div>
  </div>
{/if}
