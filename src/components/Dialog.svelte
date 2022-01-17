<script>
  import { browser } from "$app/env";
  import Fa from "svelte-fa";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import { prompt } from "$lib/store";
  import { onMount, tick } from "svelte";
  let comp;
  let ok;

  $: hideControls = comp && comp.hide;

  let focus = (p) => browser && p && tick().then(() => ok && ok.focus());
  $: focus($prompt);
</script>

{#if $prompt}
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="dialog-container flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >
      <div
        class="dialog inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <svelte:component this={$prompt} bind:this={comp} />
            </div>
          </div>
        </div>
        {#if !hideControls}
          <div class="border-t px-4 py-6 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              bind:this={ok}
              on:click={comp.submit}
              class="primary-btn mb-2 sm:mb-0 sm:ml-2"
            >
              Continue
            </button>
            <button
              type="button"
              class="secondary-btn"
              on:click={!!comp.cancel ? comp.cancel : ($prompt = undefined)}
            >
              Cancel
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .secondary-btn {
    background-color: whitesmoke;
    border: 1px solid whitesmoke;
  }

  @media only screen and (max-width: 640px) {
    .dialog-container {
      padding: 0;
    }
    .dialog {
      width: 100%;
      padding: 0;
      margin: 0;
      border-radius: 0;
    }
    .dialog :global(input) {
      width: 100%;
    }
  }
</style>
