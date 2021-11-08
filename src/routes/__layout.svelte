<script context="module">
  export async function load({ fetch, session }) {
    let { user } = await fetch('/user.json');

    console.log("user", user);

    return {
      props: {
        u: user,
        t: session.token
      },
    };
  }

</script>

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
  import { show, user, password, token } from "$lib/store";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { publicPages } from "$lib/utils";

  export let u;
  export let t;

  let open = false;
  let ready;

  $user = u;
  $token = t;

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

  <main>
    <div class="mx-auto min-h-screen">
      <App>
        <slot />
      </App>
    </div>
  </main>

  <Footer />
{/if}
