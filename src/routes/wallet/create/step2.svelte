<script>
  import { page } from "$app/stores";
  import { user } from "$lib/store";
  import { getMnemonic } from "$lib/wallet";
  import { copy, goto } from "$lib/utils";
  import { requirePassword } from "$lib/auth";

  let mnemonic;
  let displayMnemonic = async () => {
    await requirePassword();
    mnemonic = getMnemonic();
  };
  let offset = 0;

  $: displayMnemonic($page);
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

{#if mnemonic}
  <p>Write down the following 24 words in the correct order:</p>

  {#each mnemonic.split(' ').slice(offset, offset + 6) as word, i}
    <div class="text-xl text-center my-4"><b>{i + 1 + offset}</b> - {word}</div>
  {/each}

  <div class="flex justify-center text-center mt-5">
    <button on:click={() => (offset = 0)} class="pagination" class:active={offset === 0}><i
        class="fas fa-circle" /></button>
    <button on:click={() => (offset = 6)} class="pagination" class:active={offset === 6}><i
        class="fas fa-circle" /></button>
    <button on:click={() => (offset = 12)} class="pagination" class:active={offset === 12}><i
        class="fas fa-circle" /></button>
    <button on:click={() => (offset = 18)} class="pagination" class:active={offset === 18}><i
        class="fas fa-circle" /></button>
  </div>

  <div class="flex justify-center gap-6 text-center mt-5">
    <button
      on:click={() => (offset === 0 ? goto('/wallet/create/step1') : (offset -= 6))}
      class="w-2/4 secondary-btn">Back</button>
    <button
      on:click={() => (offset === 18 ? goto('/wallet/create/step3') : (offset += 6))}
      class="w-2/4 primary-btn">Next</button>
  </div>

  <p class="my-4">
    <a class="secondary-color" href="" on:click={() => copy(mnemonic)}>Copy mnemonic to clipboard</a>
  </p>
{/if}
