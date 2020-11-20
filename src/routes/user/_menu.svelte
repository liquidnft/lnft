<script>
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    goto("/login");
  };
</script>

<div class="mb-4">
  <button
    class="bg-black text-white p-2 rounded"
    on:click={() => goto(`/user/${$user.id}/edit`)}>Edit Profile</button>
</div>

<div class="mb-2 text-sm"><a href="/history">Download tx history</a></div>
<div class="mb-2 text-sm"><a href="/wallet">View Wallet</a></div>
<div class="mb-2 text-sm"><a href="/settings">Update Settings</a></div>
<div class="text-sm cursor-pointer">
  <a on:click={logout} class="cursor-pointer">Sign Out</a>
</div>
