<script>
  import { page } from "$app/stores";
  import { onMount, tick } from "svelte";
  import bip39 from "bip39";
  import ToggleSwitch from "$components/ToggleSwitch";

  $: init($page);
  let init = () => tick().then(() => inputs[0].focus());


  let words = new Array(24);
  let inputs = new Array(24);
  let show = true;
  let offset = 0;
  let curr = 0;

  let bulk = false;

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
    if (e.key === "Tab" && !e.shiftKey) e.preventDefault();
    if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) return suggestions[0] && take(suggestions[0]);
  };
</script>

<style>
  input {
    @apply border-0 border-b-2 pb-1;
  }

  .button-transparent:focus {
    background-color: #6aced5;
    border: none;
  }

  .pagination {
    color: lightgray;
    padding: 7px;
  }
  .pagination:focus {
    color: #6aced5;
  }

  .active {
    color: #6aced5;
  }
</style>

<div class="flex flex-col gap-6">
  <p>Enter your backup phrase in the correct order:</p>

  <div class="text-right">
    <ToggleSwitch
      id="list-price"
      label="Show words"
      on:change={(e) => (show = e.target.checked)}
      checked={show} />
  </div>
</div>

{#if bulk}
  <textarea
    placeholder="Type or paste your seed here."
    class="my-4 w-full"
    autofocus />
{:else}
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
    <div class="flex-grow">
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
              type="password" />
          {/if}
        </div>
      {/each}
    </div>
  </div>

  {#each suggestions as suggestion}
    <button
      class="primary-btn border mr-1"
      on:click={() => take(suggestion)}>{suggestion}</button>
  {/each}

  <div class="flex justify-center text-center mt-5">
    <button
      on:click={() => (offset = 0)}
      class="pagination"
      class:active={offset === 0}><i class="fas fa-circle" /></button>
    <button
      on:click={() => (offset = 12)}
      class="pagination"
      class:active={offset === 12}><i class="fas fa-circle" /></button>
  </div>
{/if}

<p class="my-4">
  {#if bulk}
    <a class="secondary-color" href="" on:click={() => (bulk = false)}>I want to
      enter my seed one word at a time</a>
  {:else}
    <a class="secondary-color" href="" on:click={() => (bulk = true)}>I want to
      enter my seed all at once</a>
  {/if}
</p>
