<script>
  import Avatar from "$components/Avatar";
  import { show, snack, user, token } from "$lib/store";

  export let open = false;
</script>

<style>
  .menu{
    width: 400px;
  }

  @media only screen and (max-width: 640px) {
    .menu {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 70px;
      border-top: 1px solid gray;
      width: 100%;
    }

    .menu a {
      margin: 20px 0 0 20px;
    }
    .menu .search {
      margin: 40px 0 0 45px;
    }
  }
</style>

<div class="flex justify-between items-center menu">
  <a href="/discover" on:click={() => (open = !open)} class="search">
    <i class="fas fa-search text-2xl"></i>
  </a>
  <a href="/market">
    <button on:click={() => (open = !open)}>Market</button>
  </a>
  <a href="/activity"><button
      on:click={() => (open = !open)}>Activity</button></a>
  {#if $user}
    <a href={`/user/${$user.id}`}>
      <button on:click={() => (open = !open)} class="flex">
        <Avatar src={$user.avatar_url} />
        <div class="my-auto ml-2">{$user.full_name}</div>
      </button></a>
  {:else}<a href="/login"><button on:click={() => (open = !open)} >Sign In</button></a>{/if}
</div>
