<script>
  import Fa from "svelte-fa";
  import { faCircle } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/stores";
  import { user } from "$lib/store";
  import { getMnemonic } from "$lib/wallet";
  import { copy, goto } from "$lib/utils";
  import { requirePassword } from "$lib/auth";

  let mnemonic;
  let displayMnemonic = async () => {
    if (!$user) return;
    await requirePassword();
    mnemonic = getMnemonic();
  };
  let offset = 0;

  $: displayMnemonic($page, $user);
</script>

<style>
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

  .word {
    padding: 10px;
    display: inline-block;
    border-radius: 10px;
    background-color: whitesmoke;
    font-weight: bold;
  }

  .word b {
    margin-right: 10px;
    font-size: 15px;
    color: gray;
  }
</style>

<div
  class="container">
  {#if mnemonic}
    <p>Write down the following 12 words in the correct order:</p>

    {#each mnemonic.split(' ').slice(offset, offset + 6) as word, i}
      <div class="text-xl text-center my-4">
        <p class="word"><b>{i + 1 + offset}</b> {word}</p>
      </div>
    {/each}

    <div class="flex justify-center text-center mt-5">
      <button
        on:click={() => (offset = 0)}
        class="pagination w-auto"
        class:active={offset === 0}><Fa icon={faCircle} /></button>
      <button
        on:click={() => (offset = 6)}
        class="pagination w-auto"
        class:active={offset === 6}><Fa icon={faCircle} /></button>
    </div>

    <p class="my-4">
      <a class="secondary-color" href="." on:click|preventDefault={() => copy(mnemonic)}>Copy to
        clipboard</a>
    </p>

    <div class="flex justify-center text-center mt-5">
      <button
        on:click={() => (offset === 0 ? goto('/wallet/create/step1') : (offset -= 6))}
        class="w-2/4 secondary-btn m-2">Back</button>
      <button
        on:click={() => (offset === 6 ? goto('/wallet/create/step3') : (offset += 6))}
        class="w-2/4 primary-btn m-2">Next</button>
    </div>
  {/if}
</div>
