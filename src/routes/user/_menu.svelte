<script>
  import { user } from "$lib/store";
  import { goto } from "$lib/utils";
  import { logout } from "$lib/auth";
</script>

<style>
    .menu{
      display: flex;
      flex-direction: column;
    }
    .menu a{
      margin: 10px 0;
    }
    .menu span{
      margin-left: 8px;
    }
</style>

<div class="mt-10 mb-5">
  <a
    class="primary-btn"
    href={`/user/${$user.id}/edit`}>Edit Profile</a>
</div>

<div class="menu uppercase">
  {#if !$user.is_artist}
    <a href="/become-artist">
      <i class="far fa-user-circle"></i>
      <span>Become an Artist</span>
    </a>
  {/if}
  <a href="/wallet">
    <i class="fas fa-wallet"></i>
    <span>View Wallet</span>
  </a>
  <a href="/login" on:click={logout} class="cursor-pointer">
    <i class="fas fa-sign-out-alt"></i>
    <span>Sign Out</span>
  </a>
</div>
