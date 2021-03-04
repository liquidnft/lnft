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
  let ready;

  onMount(async () => {
    ready = true;
    try {
      $user = JSON.parse(window.sessionStorage.getItem("user"));
    } catch (e) {}

    if (!$password) $password = window.sessionStorage.getItem("password");
    if (!$token) $token = window.sessionStorage.getItem("token");
  });
</script>

<style>
  :global(.secondary-color) {
    color: #3ba5ac;
  }

  :global(.brand-color) {
    background: #3ba5ac;
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

{#if ready}
  <Sidebar bind:open />
  <div in:fade>
    <Navbar bind:sidebar={open} />
  </div>
  <Dialog />

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot />
      </App>
    </div>
  </main>
  <Footer />
{/if}
