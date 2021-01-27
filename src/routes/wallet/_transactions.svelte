<script>
  import ToggleSwitch from "$components/ToggleSwitch";

  export let asset;
  let show = false;
  let transactions = new Array(6);
</script>

<div class="my-7 flex">
  <div class="flex-1">Show all history</div>
  <ToggleSwitch
    id="toggle"
    label={`Show only ${asset}`}
    on:change={(e) => (show = e.target.checked)} />
</div>

{#each transactions as tx}
  <div class="w-full mb-4">
    <div class="flex">
      <div class="flex-grow text-sm text-gray-500">Jan 13th, 2021</div>
      <div class="text-green-700">+5 assets</div>
    </div>

    <div class="">{asset} Deposit</div>
  </div>
{/each}
