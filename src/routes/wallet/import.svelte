<script>
  import Seed from "./_seed.svelte";
  let mnemonic;
  let importWallet;
</script>

<div class="w-full">
  <Seed bind:importWallet bind:mnemonic />

<div class="block">
  <div class="flex flex-col gap-6">
    <p class="mb-2">Enter your backup phrase in the correct order:</p>

    <div class="text-right">
      <ToggleSwitch
        id="list-price"
        label="Show words"
        on:change={(e) => (show = e.target.checked)} 
        checked={show}
      />
    </div>
  </div>
  <div class="flex flex-wrap mb-2">
    <div class="w-1/2 flex-grow">
      {#each words.slice(offset, offset + 6) as word, i (i)}
        <div class="flex">
          <div class="my-auto w-1/12">{i + offset + 1}.</div>
          {#if show}
            <input
              bind:value={words[i + offset]}
              on:keydown={(e) => keyup(i + offset, e)}
              key={i + offset}
              bind:this={inputs[i + offset]} />
          {:else}
            <input
              bind:value={words[i + offset]}
              on:keydown={(e) => keyup(i + offset, e)}
              key={i + offset}
              bind:this={inputs[i + offset]}
              type="password" />
          {/if}
        </div>
      {/each}
    </div>
    <div class="w-1/2 flex-grow">
      {#each words.slice(offset + 6, offset + 12) as word, i (i)}
        <div class="flex">
          <div class="my-auto w-1/12">{i + offset + 6 + 1}.</div>
          {#if show}
            <input
              bind:value={words[i + offset + 6]}
              on:keydown={(e) => keyup(i + offset + 6, e)}
              bind:this={inputs[i + offset + 6]}
              key={i + offset + 6} />
          {:else}
            <input
              bind:value={words[i + offset + 6]}
              on:keydown={(e) => keyup(i + offset + 6, e)}
              bind:this={inputs[i + offset + 6]}
              key={i + offset + 6} 
            type="password"/>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  {#each suggestions as suggestion}
    <button
      class="border mr-1"
      on:click={() => take(suggestion)}>{suggestion}</button>
  {/each}

  <div class="flex justify-center mt-5">
    <button on:click={() => (offset = 0)} class="pagination w-auto"><i class="fas fa-circle"></i></button>
    <button on:click={() => (offset = 12)} class="pagination w-auto"><i class="fas fa-circle"></i></button>
  </div>
  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => importWallet(mnemonic)}
      class="w-2/4 primary-btn">Next</button>
  </div>
</div>
