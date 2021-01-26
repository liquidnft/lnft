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

<div class="block">
  <div class="flex">
    <p class="mb-2">Enter your backup phrase in the correct order:</p>

    <div class="ml-auto">
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

  <div class="text-center">
    <button on:click={() => (offset = 0)}>1</button>
    <button on:click={() => (offset = 12)}>2</button>
  </div>
</div>
