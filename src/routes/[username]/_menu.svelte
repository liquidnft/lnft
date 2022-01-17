<script>
  import Fa from "svelte-fa";
  import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
  import { faSignOutAlt, faWallet } from "@fortawesome/free-solid-svg-icons";
  import { user } from "$lib/store";
  import { goto } from "$lib/utils";
</script>

<div class="mt-10 mb-5">
  <a class="primary-btn w-52" href={`/${$user.username}/edit`}>Edit Profile</a
  >
</div>

<div class="menu uppercase">
  {#if !$user.is_artist}
    <a href="/become-artist">
      <div class="flex">
        <div class="my-auto">
          <Fa icon={faUserCircle} />
        </div>
        <div><span>Become an Artist</span></div>
      </div>
    </a>
  {/if}
  <a href="/wallet">
    <div class="flex">
      <div class="my-auto">
        <Fa icon={faWallet} />
      </div>
      <div><span>View Wallet</span></div>
    </div>
  </a>
  <a href="/logout" class="cursor-pointer">
    <div class="flex">
      <div class="my-auto">
        <Fa icon={faSignOutAlt} />
      </div>
      <div><span>Sign Out</span></div>
    </div>
  </a>
</div>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    font-size: 15px;
  }

  .menu a {
    margin: 10px 0;
  }
  .menu span {
    margin-left: 8px;
  }
</style>
