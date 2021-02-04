<script>
  import { user, token } from "$lib/store";
  import { goto }  from "$lib/utils";

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    $user = null;
    goto("/login");
  };
</script>

<div class="my-10">
  <button
    class="primary-btn"
    on:click={() => goto(`/user/${$user.id}/edit`)}>Edit Profile</button>
</div>

<div class="uppercase">
  <div class="mb-2 mt-5"><a href="/history">Download tx history</a></div>
  <div class="mb-2 mt-5"><a href="/wallet">View Wallet</a></div>
  <div class="mb-2 mt-5"><a href="/settings">Update Settings</a></div>
  <div class="cursor-pointer mt-5">
    <a href="/login" on:click={logout} class="cursor-pointer">Sign Out</a>
  </div>
</div>