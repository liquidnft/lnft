<script>
  import Avatar from "$components/Avatar";
  import { show, snack, user, token } from "$lib/store";

  export let open = false;
</script>

<style>
  img {
    max-width: 25px;
  }

  @media only screen and (max-width: 640px) {
    .menu {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 70px;
      border-top: 1px solid gray;
    }

    .menu a {
      margin: 20px 0 0 20px;
    }
    .menu img {
      margin: 20px 0 0 20px;
    }
  }
</style>

<div class="flex flex-grow-1 menu">
  <a href="/discover" class="my-auto"><img
      on:click={() => (open = !open)}
      src="/search.svg" alt="Search"/></a>
  <a href="/market" class="my-auto ml-10"><button
      on:click={() => (open = !open)}>Market</button></a>
  <a href="/activity" class="my-auto ml-10"><button
      on:click={() => (open = !open)}>Activity</button></a>
  {#if $user}
    <a href={`/user/${$user.id}`} class="ml-10">
      <button on:click={() => (open = !open)} class="flex">
        <Avatar src={$user.avatar_url} />
        <div class="my-auto ml-2">{$user.full_name}</div>
      </button></a>
  {:else}<a href="/login"><button>Sign In</button></a>{/if}
</div>
