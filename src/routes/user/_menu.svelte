<script>
  import { user } from "$lib/store";
  import { goto } from "$lib/utils";
  import { logout } from "$lib/auth";
</script>

<div class="my-10">
  <button
    class="primary-btn"
    on:click={() => goto(`/user/${$user.id}/edit`)}>Edit Profile</button>
</div>

<div class="uppercase">
  {#if !user.is_artist}
    <div class="mb-2 mt-5"><a href="/become-artist">Become an Artist</a></div>
  {/if}
  <div class="mb-2 mt-5"><a href="/wallet">View Wallet</a></div>
  <div class="cursor-pointer mt-5">
    <a href="/login" on:click={logout} class="cursor-pointer">Sign Out</a>
  </div>
</div>
