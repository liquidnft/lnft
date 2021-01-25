<script>
  import ToggleSwitch from "$components/ToggleSwitch";

  let words = new Array(24);
  let show = true;
  let offset = 0;
</script>

<div class="block">
  <div class="flex">
    <p>Enter your backup phrase in the correct order:</p>

    <div class="ml-auto">
      <ToggleSwitch
        id="list-price"
        label="Show words"
        on:change={(e) => (show = e.target.checked)} />
    </div>
  </div>
  {#each words.slice(offset, offset + 11) as word, i (i)}
    <div>{i + offset + 1}. <input bind:value={words[i+offset]} /></div>
  {/each}

  <div class="text-center">
    <button on:click={() => (offset = 0)}>1</button>
    <button on:click={() => (offset = 12)}>2</button>
  </div>
</div>
