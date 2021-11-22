<script context="module">
  export async function load({ fetch, page }) {
    const props = await fetch(`/addresses.json`).then((r) => r.json());

    return {
      maxage: 90,
      props,
    };
  }

</script>

<script>
  import { session } from "$app/stores";
  import decode from "jwt-decode";
  import {
    Avatar,
    ProgressLinear,
    Sidebar,
    Navbar,
    Dialog,
    Footer,
    Snack,
    Head,
  } from "$comp";
  import {
    addresses as addressesStore,
    prompt,
    show,
    user,
    password,
    titles as titlesStore,
    token,
  } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { publicPages } from "$lib/utils";

  export let addresses, titles;

  let open = false;

  $user = $session.user;
  $token = $session.jwt;

  $addressesStore = addresses;
  $titlesStore = titles;

  onMount(() => {
    if (!$password) $password = window.sessionStorage.getItem("password");
  });

  let y;

</script>

<style global src="../main.css">
</style>

<svelte:window bind:scrollY={y} />

<Head />
<Snack />

<Sidebar bind:open />
<div class={y > 50 ? 'sticky' : ''} in:fade>
  <Navbar bind:sidebar={open} />
</div>
<Dialog />

<main>
  <div class="mx-auto min-h-screen">
    <slot />
  </div>
</main>

<Footer />
