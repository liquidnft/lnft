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
  import { Sidebar, Navbar, Dialog, Footer, Snack, Head } from "$comp";
  import {
    addresses as a,
    titles as t,
    user,
    password,
    token,
  } from "$lib/store";
  import { onMount } from "svelte";

  export let addresses, titles;

  $a = addresses;
  $t = titles;

  $user = $session.user;
  $token = $session.jwt;

  let open = false;
  let y;

  onMount(() => {
    if (!$password) $password = window.sessionStorage.getItem("password");
  });

</script>

<svelte:window bind:scrollY={y} />

<Head />
<Snack />

<Sidebar bind:open />
<div class={y > 50 ? "sticky" : ""}>
  <Navbar bind:sidebar={open} />
</div>
<Dialog />

<main>
  <div class="mx-auto min-h-screen">
    <slot />
  </div>
</main>

<Footer />

<style global src="../main.css">
</style>
