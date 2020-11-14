<script>
  import { user, token } from "$lib/store";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { routeHasChanged, trackLocation } from "$lib/location";
  import goto from "$lib/goto";
  import getUser from "$lib/getUser";
  import Avatar from "$components/Avatar";

  let show;

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

  $: (async (t) => ($user = await getUser(t)))($token);
</script>

<style>
  button {
    @apply p-4 mx-2;
  }
</style>

<div class="flex p-4">
  <h1 class="flex-auto my-auto text-teal-400 text-3xl">
    <a href="/">Liquid Art</a>
  </h1>
  <div class="flex flex-grow-1">
    <a href="/market" class="my-auto"><button>Market</button></a>
    <a href="/activity" class="my-auto"><button>Activity</button></a>
    <a href="/issue" class="my-auto"><button class="my-auto">Issue</button></a>
    {#if $user}
      <a href={`/user/${$user.id}`}>
        <button class="flex">
          <Avatar /> <div class="my-auto ml-2">Profile</div>
      </button></a>
    {:else}<a href="/login"><button>Sign In</button></a>{/if}
  </div>
</div>

<main class="p-4">
  <section class="py-12">
    <div class="container mx-auto">
      {#if show}
        <slot />
      {/if}
    </div>
  </section>
</main>
