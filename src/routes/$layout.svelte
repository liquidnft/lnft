<script>
  import decode from "jwt-decode";
  import { App, Avatar, ProgressLinear } from "$comp";
  import { show, snack, user, token } from "$lib/store";
  import { onMount, afterUpdate } from "svelte";
  import goto from "$lib/goto";
  import { fade } from "svelte/transition";

  export let segment;

  let clearSnack = () => setTimeout(() => ($snack = null), 5000);
  $: clearSnack($snack);

  afterUpdate(() => {
    if (
      (!$token || decode($token).exp * 1000 < Date.now()) &&
      segment !== "login"
    )
      goto("/login");
    else $show = true;
  });

  onMount(() => {
    if (!$token) $token = window.sessionStorage.getItem("token");
  });
</script>

<style>
  :global(.title) {
    @apply text-2xl font-black text-gray-900 pb-6;
  }

  img {
    max-width: 25px;
  } 
</style>

<div class="flex p-4">
  <h1 class="flex-auto my-auto text-green-400 text-3xl">
    <a href="/">L<span class="text-black">iquid</span>
      A<span class="text-black">rt</span></a>
  </h1>
  <div class="flex flex-grow-1">
    <a href="/discover" class="my-auto"><img src="/search.svg" /></a>
    <a href="/market" class="my-auto"><button>Market</button></a>
    <a href="/activity" class="my-auto"><button>Activity</button></a>
    {#if $user}
      <a href={`/user/${$user.id}`}>
        <button class="flex">
          <Avatar src={$user.avatar_url} />
          <div class="my-auto ml-2">{$user.full_name}</div>
        </button></a>
    {:else}<a href="/login"><button>Sign In</button></a>{/if}
  </div>
</div>

{#if $snack}
  <div class="fixed w-full flex z-10">
    <div
      class="border-2 border-green-400 px-4 py-3 rounded relative mb-4 mx-auto w-1/6 text-center font-bold bg-white">
      {$snack}
    </div>
  </div>
{/if}

<main>
  <div class="container mx-auto px-12">
    {#if $show}
      <App {segment}>
        <slot />
      </App>
    {/if}
  </div>
</main>
