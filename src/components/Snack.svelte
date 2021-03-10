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
    right: 10%;
    top: 10%;
  }

  .snack {
    @apply px-4 py-3 rounded relative mb-4 mx-auto font-bold bg-white;
  }

  .snack.info {
    background: #6ed8e0;
  }

  .snack.error {
    @apply bg-gray-200 text-red-600;
  }
</style>

{#if $snack}
  <div class="snack-container">
    <div class="snack mx-0 w-full flex"  class:info class:error>
      <div class="flex-grow">{$snack.msg}</div>
      <button class="ml-auto my-auto w-auto" on:click={() => $snack = undefined}><i class="fa fa-times text-2xl" /></button>
    </div>
  </div>
{/if}
