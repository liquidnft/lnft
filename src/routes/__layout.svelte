<script context="module">
  import { prerendering } from "$app/env";
  import { get } from "$lib/api";
  import "../main.css";

  export async function load({ fetch, url, session }) {
    if (prerendering)
      return {
        props: {
          addresses: [],
          titles: [],
        },
      };

    const props = await get(`/addresses.json`, fetch);

    if (
      session &&
      session.user &&
      !session.user.wallet_initialized &&
      !["/wallet", "/logout"].find((p) => url.pathname.includes(p))
    )
      return {
        status: 302,
        redirect: "/wallet/setup",
      };

    return {
      props,
    };
  }
</script>

<script>
  import { browser } from "$app/env";
  import { page, session } from "$app/stores";
  import decode from "jwt-decode";
  import { Sidebar, Navbar, Dialog, Footer, Snack, Head } from "$comp";
  import {
    addresses as a,
    meta,
    titles as t,
    user,
    password,
    poll,
    token,
  } from "$lib/store";
  import { onDestroy, onMount } from "svelte";
  import branding from "$lib/branding";

  export let addresses, titles;

  let interval;
  let refresh = async () => {
    try {
      let { jwt_token } = await get("/auth/refresh.json", fetch);
      $token = jwt_token;
      if (!$token && $session) delete $session.user;
    } catch (e) {
      console.log(e);
    }
  };

  if (browser) {
    history.pushState = new Proxy(history.pushState, {
      apply(target, thisArg, argumentsList) {
        Reflect.apply(target, thisArg, argumentsList);
        scrollTo(0, 0);
      },
    });

    $a = addresses;
    $t = titles;

    if ($session) {
      $user = $session.user;
      $token = $session.jwt;
    }

    interval = setInterval(refresh, 60000);
  }

  let open = false;
  let y;

  let stopPolling = () => $poll.map(clearInterval);
  $: stopPolling($page);

  onDestroy(() => clearInterval(interval));
  onMount(() => {
    if (browser && !$password)
      $password = window.sessionStorage.getItem("password");
  });
</script>

<svelte:window bind:scrollY={y} />

{#if !($page.url.pathname.includes("/a/") && $page.url.pathname.split("/").length === 3)}
  <Head metadata={branding.meta} />
{/if}

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
