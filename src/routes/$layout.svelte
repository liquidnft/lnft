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

    if (!$password) $password = window.sessionStorage.getItem("password");
    if (!$token) $token = window.sessionStorage.getItem("token");
  });

  let y;
</script>

<style global src="../main.css" />

<svelte:window bind:scrollY={y} />

<Snack />

{#if ready}
  {#if !['/', '/login', '/register'].includes($page.path)}
    <Sidebar bind:open />
    <div class={y > 300 ? 'sticky' : ''} in:fade>
      <Navbar bind:sidebar={open} />
    </div>
    <Dialog />
  {/if}

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot/>
      </App>
    </div>
  </main>

  {#if !['/', '/login', '/register'].includes($page.path)}
    <Footer />
  {/if}
{/if}
