<script>
  import { snack, user, token } from "$lib/store";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { routeHasChanged, trackLocation } from "$lib/location";
  import goto from "$lib/goto";
  import { getUser } from "$queries/users";
  import Avatar from "$components/Avatar";
  import { api } from "$lib/api";

  let show;

  let clearSnack = () => setTimeout(() => ($snack = null), 5000);
  $: clearSnack($snack);

  trackLocation();
  afterUpdate(() => {
    if (
      $routeHasChanged &&
      !$token &&
      !window.location.pathname.startsWith("/login")
    )
      return goto("/login");

    show = true;
  });

  onMount(() => {
    if (!$token) $token = window.sessionStorage.getItem("token");
  });

  let timeout;

  let tokenUpdated = async (t) => {
    if (t) timeout = setTimeout(() => refreshToken(t), 600000);
    else clearTimeout(timeout);
    $user = await getUser(t);
  };

  let refreshToken = (t) => {
    api
      .url("/auth/token/refresh")
      .auth(`Bearer ${t}`)
      .get()
      .json((r) => {
        $token = r.jwt_token;
        window.sessionStorage.setItem("token", $token);
      });
  };

  $: tokenUpdated($token);
</script>

<style>
  :global(button) {
    @apply p-4;
  }

  :global(input, textarea, select) {
    @apply border p-4;
    overflow-y: auto;
  }
</style>

<div class="flex p-4">
  <h1 class="flex-auto my-auto text-teal-400 text-3xl">
    <a href="/">L<span class="text-black">iquid</span> A<span class="text-black">rt</span></a>
  </h1>
  <div class="flex flex-grow-1">
    <a href="/market" class="my-auto"><button>Market</button></a>
    <a href="/activity" class="my-auto"><button>Activity</button></a>
    <a href="/issue" class="my-auto"><button class="my-auto">Issue</button></a>
    {#if $user}
      <a href={`/user/${$user.id}`}>
        <button class="flex">
          <Avatar />
          <div class="my-auto ml-2">{$user.full_name}</div>
        </button></a>
    {:else}<a href="/login"><button>Sign In</button></a>{/if}
  </div>
</div>

{#if $snack}
<div class="fixed w-full flex z-10">
  <div
    class="border-2 border-teal-400 px-4 py-3 rounded relative mb-4 mx-auto w-1/6 text-center font-bold bg-white">
    {$snack}
  </div>
</div>
{/if}

<main class="p-4">
  <section class="py-12">
    <div class="container mx-auto">
      {#if show}
        <slot />
      {/if}
    </div>
  </section>
</main>
