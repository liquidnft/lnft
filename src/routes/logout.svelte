<script context="module">
  export async function load({ fetch, session }) {
    try {
      await fetch("/auth/logout");
    } catch (e) {
      console.log(e);
    }

    return {};
  }

</script>

<script>
  import { session } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$lib/utils";
  import { user, token } from "$lib/store";

  onMount(() => {
    session.set(null);
    token.set(null);
    user.set(null);
    goto("/login");
  });

</script>
