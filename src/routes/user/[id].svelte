<script context="module">
  export async function preload({ params }) {
    return params;
  }
</script>

<script>
  import { goto } from "/_app/main/runtime/navigation";
  import { token } from "$components/store";

  export let id;

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    goto("/login");
  };
  </script>

  <div class="mb-2">User ID: {id}</div>
  <div>
    <button
      on:click={logout}
      class="block bg-teal-600 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1 ml-1"
      type="submit">Logout</button>
  </div>
