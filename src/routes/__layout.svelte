<script>
  import { page } from "$app/stores";
  import decode from "jwt-decode";
  import {
    App,
    Avatar,
    ProgressLinear,
    Sidebar,
    Dialog,
    Footer,
    Snack,
    Head,
  } from "$comp";
  import Navbar from "$styleguide/components/Navbar";
  import { show, user, password, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { publicPages } from "$lib/utils";
  import "./layout.css";

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

  <div class="bg-black sticky-container">
    <div class={y > 50 ? 'sticky' : ''} in:fade>
      <Navbar bind:sidebar={open} />
    </div>
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
