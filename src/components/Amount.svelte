<script>
  export let value;
  let amount;
  export let focus = () => amount.focus();
</script>

<svelte:options accessors={true} />
<div class="flex flex-col mb-4">
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        id="price"
        class="form-input block w-full pl-7"
        placeholder="0.00"
        bind:value
        bind:this={amount}
      />
      <div class="absolute inset-y-0 right-0 flex items-center">
        <select
          class="border-transparent bg-transparent text-gray-500 p-0 h-full">
          <option>BTC</option>
          <option selected>mBTC</option>
          <option>SATS</option>
        </select>
      </div>
    </div>
  </div>
</div>
