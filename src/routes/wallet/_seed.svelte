<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import { onMount, tick } from "svelte";
  import wordlist from "$lib/wordlist";
  import { ToggleSwitch } from "$comp";
  import { password, token, user } from "$lib/store";
  import { err, goto, info } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import { createWallet } from "$lib/wallet";
  import { updateUser } from "$queries/users";
  import { query } from "$lib/api";

  export let mnemonic;

  $: mnemonic = words.filter((w) => w).join(" ");

  export const importWallet = async (mnemonic) => {
    await requirePassword();

    try {
      let params = createWallet(mnemonic);
      params.wallet_initialized = true;

      await query(updateUser, {
        user: params,
        id: $user.id,
      });

      info("Wallet is ready!");

      $user.wallet_initialized = true;

      setTimeout(() => goto("/wallet"), 50);
    } catch (e) {
      console.log(e);
      err(e);
    }
  };

  let typed;
  let setMnemonic = () => (mnemonic = typed);

  let toggle = () => {
    bulk = !bulk;
    tick().then(() => {
      if (bulk) typed = mnemonic;
      else if (typed)
        words = [
          ...typed.split(" "),
          ...new Array(12 - typed.split(" ").length),
        ];
      curr = words.findIndex((w) => !w);
      if (inputs[curr]) inputs[curr].select();
    });
  };

  $: init($page);
  let init = () => browser && tick().then(() => inputs[0].focus());

  let words = new Array(12);
  let inputs = new Array(12);
  let show = true;
  let curr = 0;

  let bulk = false;

  let suggestions;
  $: suggestions = wordlist.filter((w) =>
    w.startsWith(words[curr])
  ).slice(0, 5);

  let take = async (suggestion) => {
    words[curr] = suggestion;
    curr++;

    await tick();

    suggestions = [];
  };

  let keyup = (i, e) => {
    curr = i;
    if (e.key === "Tab" && !e.shiftKey) e.preventDefault();
    if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey))
      return suggestions[0] && take(suggestions[0]);
  };

</script>

<style>
  input {
    @apply border-0 border-b-2 pb-1;
    width: 75%;
    margin-left: 20px;
  }

  @media only screen and (max-width: 640px) {
    .suggestions {
      position: fixed;
      bottom: 80px;
      left: 0;
      width: 100vw;
    }
  }

</style>

<div class="p-5">
  <div class="flex flex-col">
    <p>Enter your backup phrase in the correct order:</p>

    {#if !bulk}
      <div class="text-right mt-5">
        <ToggleSwitch
          id="list-price"
          label="Show words"
          on:change={(e) => (show = e.target.checked)}
          checked={show} />
      </div>
    {/if}
  </div>

  {#if bulk}
    <textarea
      bind:value={typed}
      placeholder="Type or paste your seed here"
      class="my-4 w-full"
      on:blur={setMnemonic} />
  {:else}
    <div class="flex flex-wrap mb-2">
      <div class="mr-2 sm:mr-0 flex-grow w-1/4 sm:w-1/2">
        {#each words.slice(0, 6) as word, i (i)}
          <div class="flex">
            <div class="my-auto w-1/12">{i + 1}.</div>
            {#if show}
              <input
                bind:value={words[i]}
                on:keydown={(e) => keyup(i, e)}
                key={i}
                bind:this={inputs[i]} />
            {:else}
              <input
                bind:value={words[i]}
                on:keydown={(e) => keyup(i, e)}
                key={i}
                bind:this={inputs[i]}
                type="password" />
            {/if}
          </div>
        {/each}
      </div>
      <div class="flex-grow w-1/4 sm:w-1/2">
        {#each words.slice(6, 12) as word, i (i)}
          <div class="flex">
            <div class="my-auto w-1/12">{i + 6 + 1}.</div>
            {#if show}
              <input
                bind:value={words[i + 6]}
                on:keydown={(e) => keyup(i + 6, e)}
                bind:this={inputs[i + 6]}
                key={i + 6} />
            {:else}
              <input
                bind:value={words[i + 6]}
                on:keydown={(e) => keyup(i + 6, e)}
                bind:this={inputs[i + 6]}
                key={i + 6}
                type="password" />
            {/if}
          </div>
        {/each}
      </div>
    </div>
    <div class="suggestions mt-8 flex flex-wrap justify-center">
      {#each suggestions as suggestion}
        <button
          class="primary-btn w-auto border m-1"
          on:click={() => take(suggestion)}>{suggestion}</button>
      {/each}
    </div>
  {/if}

  <p class="my-4">
    {#if bulk}
      <a
        class="secondary-color my-2"
        href="/"
        on:click|preventDefault={toggle}>I want to enter one word at a time</a>
    {:else}
      <a
        class="secondary-color my-2"
        href="/"
        on:click|preventDefault={toggle}>I want to type in a text box</a>
    {/if}
  </p>
</div>
