<script>
  import { token } from "$components/store";
  import { onMount, afterUpdate } from "svelte";
  import { routeHasChanged, trackLocation } from "$components/location";

  trackLocation();
  afterUpdate(() => {
    if ($routeHasChanged) {
      if (!$token) {
        if (!window.location.pathname.startsWith("/login")) window.location = "/login";
      }
    }  
  });

  onMount(() => {
    if (!$token) $token = window.sessionStorage.getItem("token");
  });

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    window.location = '/login';
  };
</script>

<style>
  button {
    @apply p-4 mx-2;
  }
</style>

<div class="flex p-4">
  <h1 class="flex-auto my-auto text-teal-600 text-lg">
    <a href="/">Liquid Art</a>
  </h1>
  <div class="flex-grow-1">
    <a href="/market"><button>Market</button></a>
    <a href="/activity"><button>Activity</button></a>
    <a href="/issue"><button>Issue</button></a>
    {#if $token}
      <button on:click={logout}>Logout</button>
    {:else}<a href="/login"><button>Sign In</button></a>{/if}
  </div>
</div>

<main class="p-4">
  <slot />
</main>
