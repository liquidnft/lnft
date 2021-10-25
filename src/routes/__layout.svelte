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
    Snack,
    Head,
  } from "$comp";
  import { secret, show, user, password, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { publicPages } from "$lib/utils";
  import "./vars.css";
  import "./layout.css";
  import { browser } from "$app/env";

  let open = false;
  let ready;

  onMount(async () => {
    ready = true;

    if (!$secret) $secret = window.localStorage.getItem("secret");
    if (!$password) $password = window.sessionStorage.getItem("password");
    if (!$token) $token = window.sessionStorage.getItem("token");
  });

  $: saveSecret($secret);
  let saveSecret = (s) => browser && s === "peace" && window.localStorage.setItem("secret", s);

  let y;

</script>

<style global src="../main.css">
</style>

<svelte:window bind:scrollY={y} />

<Head />
<Snack />

{#if $secret === 'peace'}
  {#if ready}
    <Sidebar bind:open />
    <div class={y > 50 ? 'sticky' : ''} in:fade>
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
{:else}
  <div class="flex w-full h-screen">
    <div class="m-auto text-center">
      <div>Enter Password</div>
      <input bind:value={$secret} />
    </div>
  </div>
{/if}
