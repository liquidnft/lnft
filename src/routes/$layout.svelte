<script>
  import decode from "jwt-decode";
  import {
    App,
    Avatar,
    ProgressLinear,
    Sidebar,
    Navbar,
    Dialog,
    Footer,
  } from "$comp";
  import Snack from "$components/Snack";
  import { show, user, password, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import "@fortawesome/fontawesome-free/js/all.js";

  let open = false;
  let mounted = false;

  onMount(async () => {
    if (!$password) $password = window.sessionStorage.getItem("password");
    if (!$token) $token = window.sessionStorage.getItem("token");
    mounted = true;
  });
</script>

<style>
  :global(.secondary-color) {
    color: #3ba5ac;
  }

  :global(.brand-color) {
    background: #3ba5ac;
  }

  :global(.button-transparent) {
    background-color: none;
    border: 1px solid #133e7c;
    color: #133e7c;
  }

  :global(.button-trans-gray) {
    background-color: none;
    border: 1px solid gray !important;
    color: white;
  }

  :global(button:focus, select:focus) {
    outline: none;
  }

  :global(button:hover) {
    color: rgb(84, 110, 157);
  }

  :global(input, textarea, select) {
    @apply border p-4 bg-white focus:outline-none;
    overflow-y: auto;
  }

  :global(.title) {
    @apply font-bold pb-14 text-4xl text-left;
    color: #133e7c;
  }

  :global(.sub-title) {
    font-weight: bold;
    font-size: 20px;
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

<Snack />

{#if mounted}
  <Sidebar bind:open />
  <Navbar bind:sidebar={open} />
  <Dialog />

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot />
      </App>
    </div>
  </main>
  <Footer />
{:else}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{/if}
