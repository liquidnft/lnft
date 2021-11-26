<svelte:options accessors={true} />

<script>
  export let value;
  let amount;
  export let unit;
  export const focus = () => amount.focus();
</script>

<div class="flex flex-col mb-4">
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        id="price"
        class="form-input block w-full pl-7"
        placeholder="0"
        bind:value
        bind:this={amount}
      />
      {#if unit}
        <div class="absolute inset-y-0 right-0 flex items-center mr-2">
          {unit}
        </div>
      {/if}
    </div>
  </div>
</div>
