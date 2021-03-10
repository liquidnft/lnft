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
    top: 3em;
  }

  .snack {
    @apply relative w-full flex p-4 rounded;
  }

  .snack.info {
    background: #6ed8e0;
  }

  .snack.error {
    @apply bg-gray-200 text-red-600;
  }
</style>

{#if $snack}
  <div class="snack-container flex">
    <div class="snack"  class:info class:error>
      <div class="flex-grow mr-2">{$snack.msg}</div>
      <button class="ml-auto my-auto w-auto" on:click={() => $snack = undefined}><i class="fa fa-times text-2xl" /></button>
    </div>
  </div>
{/if}
