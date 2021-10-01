<script>
  import { page } from "$app/stores";
  import decode from "jwt-decode";
  import {
    App,
    Avatar,
    Cursor,
    ProgressLinear,
    Sidebar,
    Navbar,
    Dialog,
    Footer,
    Snack,
    Head,
  } from "$comp";
  import { show, user, password, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { publicPages } from "$lib/utils";

  let open = false;
  let ready;

  onMount(async () => {
    ready = true;

    if (!$password) $password = window.sessionStorage.getItem("password");
    if (!$token) $token = window.sessionStorage.getItem("token");
  });

  let y;

</script>

<style global src="../main.css">
</style>

<svelte:window bind:scrollY={y} />

<Head />
<Snack />

{#if ready}
  <Sidebar bind:open />
  <div class={y > 50 ? 'sticky' : ''} in:fade>
    <Navbar bind:sidebar={open} />
  </div>
  <Dialog />


  <div id="edgtf-theme-cursor" class="">
    <svg
      x="0px"
      y="0px"
      width="48px"
      height="48px"
      viewBox="0 0 48 48"
      xml:space="preserve">
      <circle id="edgtf-cursor-dot" cx="28" cy="28" r="14" />
      <path id="edgtf-cursor-flame" fill="#FFFFFF" />
      <path id="edgtf-cursor-cart" fill="#FFFFFF" />
      <path id="edgtf-cursor-close" fill="#FFFFFF" />
      <path id="edgtf-cursor-move" fill="#FFFFFF" />
      <path id="edgtf-cursor-eye" fill="#FFFFFF" />
    </svg>
  </div>

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot />
      </App>
    </div>
  </main>

  <Cursor />
  <Footer />
{/if}
