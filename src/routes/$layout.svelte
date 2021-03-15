<script>
  import { page } from "$app/stores";
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

  let y;

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

  .sticky{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255);
    box-shadow: 0px 0px 5px 0px #cbcbcb;
    z-index: 300;
    padding-bottom: 10px;
  }
</style>

<svelte:window bind:scrollY={y}/>

<Snack />

{#if ready}
  {#if !['/', '/login', '/register'].includes($page.path)}
  <Sidebar bind:open />
  <div class="{y > 300 ? 'sticky' : ''}" in:fade>
    <Navbar bind:sidebar={open} />
  </div>
  <Dialog />
{/if}

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot />
      </App>
    </div>
  </main>

  {#if !['/', '/login', '/register'].includes($page.path)}
  <Footer />
{/if}
{/if}
