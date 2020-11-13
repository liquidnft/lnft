<script>
  import { user, token } from "$components/store";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { routeHasChanged, trackLocation } from "$components/location";
  import { goto } from "/_app/main/runtime/navigation";
  import getUser from "$components/getUser";

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

  let hey = async (t) => {
    console.log("hey!", t);
    $user = await getUser(t);
    console.log($user);
  };

  $: hey($token);
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
  <div class="flex-grow-1">
    <a href="/market"><button>Market</button></a>
    <a href="/activity"><button>Activity</button></a>
    <a href="/issue"><button>Issue</button></a>
    {#if $user}
      <a href={`/user/${$user.id}`}><button>Profile</button></a>
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
