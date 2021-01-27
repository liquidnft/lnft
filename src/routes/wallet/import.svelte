<script>
  import { tick } from "svelte";
  import bip39 from "bip39";
  import ToggleSwitch from "$components/ToggleSwitch";

  let words = new Array(24);
  let inputs = new Array(24);
  let show = true;
  let offset = 0;
  let curr = 0;

  let suggestions;
  $: suggestions = bip39.wordlists.EN.filter((w) =>
    w.startsWith(words[curr])
  ).slice(0, 5);

  let take = async (suggestion) => {
    words[curr] = suggestion;
    curr++;
    if (curr === 12) {
      offset = 12;
    }
    await tick();
    inputs[curr - offset].focus();
    inputs[curr - offset].select();
    suggestions = [];
  };

  let keyup = (i, e) => {
    curr = i;
    if (e.key === "Tab") e.preventDefault();
    if (e.key === "Enter" || e.key === "Tab") return take(suggestions[0]);
  };
</script>

<style>

  input{
    @apply border-0 border-b-2;
  }

  .button-transparent:focus {     
    background-color:#6aced5; 
    border: none;   
  }
  
  .pagination{
    color:lightgray;
    padding: 7px;
  }
  .pagination:focus{
    color: #6aced5;
  }
</style>



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
    <div class="mr-2 flex-grow">
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
    <div class="mr-2 flex-grow">
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

  <div class="flex justify-center text-center mt-5">
    <button on:click={() => (offset = 0)} class="pagination"><i class="fas fa-circle"></i></button>
    <button on:click={() => (offset = 12)} class="pagination"><i class="fas fa-circle"></i></button>
  </div>
  <div class="flex justify-center gap-6 text-center mt-5">
    <button on:click={() => (offset = 0)} class="w-2/4 button-transparent">Back</button>
    <button on:click={() => (offset = 12)} class="w-2/4 button-transparent">Next</button>
  </div>
</div>
