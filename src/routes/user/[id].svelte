<script>
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    goto("/login");
  };
</script>

{#if $user}
  <div class="mb-2">Username: {$user.username}</div>
  <div class="mb-2">Id: {$user.id}</div>
  <div>
    <button
      on:click={logout}
      class="block bg-teal-600 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1 ml-1"
      type="submit">Logout</button>
  </div>
{/if}
