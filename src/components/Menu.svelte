<script>
  import Avatar from "$components/Avatar";
  import { show, user, token } from "$lib/store";

  export let open = false;
  let toggle = () => (open = !open);
</script>

<style>
  .menu {
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
  <a href="/discover" on:click={toggle} class="search">
    <i class="fas fa-search text-2xl" />
  </a>
  <a href="/market"><button on:click={toggle}>Market</button></a>
  <a href="/activity"><button on:click={toggle}>Activity</button></a>
  <a href="/blog"><button on:click={toggle}>Blog</button></a>
  {#if $user}
    {#if $user.is_admin}
    <a href="/admin"><button on:click={toggle}>Admin</button></a>
  {/if}
    <a href={`/user/${$user.id}`}>
      <button on:click={toggle} class="flex">
        <Avatar src={$user.avatar_url} />
        <div class="my-auto ml-2">{$user.full_name}</div>
      </button></a>
  {:else}<a href="/login"><button on:click={toggle}>Sign In</button></a>{/if}
</div>
