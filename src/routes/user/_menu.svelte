<script>
  import { user, token } from "$lib/store";
  import { goto }  from "$app/navigation";

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    $user = null;
    goto("/login");
  };
</script>

<style>
  .edit-button{
    max-width: 150px;
  }

  hr{
    margin: 30px 0;
    border: 1px solid #cdcdcd;
  }
</style>
<hr>
<div class="mb-4">
  <button
    class="bg-black text-white p-2 rounded brand-color edit-button"
    on:click={() => goto(`/user/${$user.id}/edit`)}>Edit Profile</button>
</div>

<div class="mb-2 text-sm mt-5"><a href="/history">Download tx history</a></div>
<div class="mb-2 text-sm mt-5"><a href="/wallet">View Wallet</a></div>
<div class="mb-2 text-sm mt-5"><a href="/settings">Update Settings</a></div>
<div class="text-sm cursor-pointer mt-5">
  <a on:click={logout} class="cursor-pointer">Sign Out</a>
</div>
