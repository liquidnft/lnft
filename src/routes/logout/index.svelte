<script context="module">
  import { post } from "$lib/api";
  export async function load({ fetch }) {
    await post("/auth/logout", {}, fetch).res();
    return {};
  }
</script>

<script>
  import { session } from "$app/stores";
  import { browser } from "$app/env";
  import { goto } from "$app/navigation";

  if (browser) {
    $session = {};
    window.sessionStorage.removeItem("password");
    window.sessionStorage.removeItem("username");
    goto("/login");
  }
</script>
