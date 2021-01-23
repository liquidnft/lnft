<script>
  import decode from "jwt-decode";
  import {
    App,
    Avatar,
    ProgressLinear,
    Sidebar,
    Navbar,
    Dialog,
  } from "$comp";
  import { show, snack, user, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let clearSnack = () => setTimeout(() => ($snack = null), 5000);
  $: clearSnack($snack);

  let open = false;
  let mounted = false;

  onMount(async () => {
    if (!$token) $token = window.sessionStorage.getItem("token");
    mounted = true;
  });
</script>

<style>
  :global(.primary-color) {
    color: #133e7c;
  }

  :global(.secondary-color) {
    color: #3ba5ac;
  }

  :global(.brand-color) {
    background-color: #6aced5;
  }

  :global(button) {
    border-radius: 30px !important;
    padding: 0.7rem 1.2rem;
    color: #444444;
    font-weight: bold;
  }

  :global(.button-transparent) {
    background-color: none;
    border: 1px solid #133e7c;
    color: #133e7c;
  }

  :global(button:focus, select:focus) {
    outline: none;
  }

  :global(button:hover) {
    color: gray;
  }

  :global(input, textarea, select) {
    @apply border p-4 bg-white;
    overflow-y: auto;
  }

  :global(.title) {
    @apply font-black pb-14;
    text-align: center !important;
    font-size: 2.3rem;
  }

  :global(.sub-title) {
    font-weight: bold;
    font-size: 20px;
    color: #05b298;
  }

  :global(a:hover) {
    color: #05b298;
  }

  :global(body) { 
    font-size: 17px;
    color: #525252;
  }

  :global(.box-shadow) { 
    box-shadow: 1px 1px 10px 1px #cbcbcb;
  }
</style>

{#if $snack}
  <div class="fixed w-full flex z-20 mt-6">
    <div
      class="border-2 border-green-400 px-4 py-3 rounded relative mb-4 mx-auto w-1/6 text-center font-bold bg-white">
      {$snack}
    </div>
  </div>
{/if}

{#if mounted}
  <Sidebar bind:open />
  <Navbar bind:sidebar={open} />
  <Dialog />

  <main>
    <div class="mx-auto">
      <App>
        <slot />
      </App>
    </div>
  </main>
{:else}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{/if}
