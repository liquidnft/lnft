<script>
  import ToggleSwitch from "$components/ToggleSwitch";

  let words = new Array(24);
  let show = true;
  let offset = 0;
</script>

<style>
.button-transparent:focus {     
  background-color:#6aced5; 
  border: none;   
}

.pagination{
  color:lightgray;
}
.pagination:focus{
  color: #6aced5;
}
</style>

<div class="block w-3/4">
  <div class="flex flex-col gap-6">
    <p>Enter your backup phrase in the correct order:</p>

    <div class="text-right">
      <ToggleSwitch
        id="list-price"
        label="Show words"
        on:change={(e) => (show = e.target.checked)} />
    </div>
  </div>
  {#each words.slice(offset, offset + 11) as word, i (i)}
    <div class="flex gap-3">
      <span class="mt-8">{i + offset + 1}</span>
      <input bind:value={words[i+offset]} class="border-0 border-b-2"/>
    </div>
  {/each}

  <div class="flex justify-center text-center mt-5">
    <button on:click={() => (offset = 0)} class="pagination"><i class="fas fa-circle"></i></button>
    <button on:click={() => (offset = 12)} class="pagination"><i class="fas fa-circle"></i></button>
  </div>
  <div class="flex justify-center gap-6 text-center mt-5">
    <button on:click={() => (offset = 0)} class="w-2/4 secondary-btn">Back</button>
    <button on:click={() => (offset = 12)} class="w-2/4 secondary-btn">Next</button>
  </div>
</div>
