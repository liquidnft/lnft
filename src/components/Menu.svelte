<script>
  import { Avatar } from "$comp";
  import Search from "$styleguide/components/Search";
  import { show, user, token } from "$lib/store";
  import branding from "$lib/branding";
  import { logout } from "$lib/auth";

  export let open = false;
  let toggle = () => (open = !open);
</script>

<style>
  .menu button {
    width: auto;
    text-align: left;
    padding: 0 20px;
  }

  .menu .signin {
    width: 120px;
  }

  @media only screen and (max-width: 1023px) {
    .menu {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 50px;
      border-top: 1px solid gray;
      width: 100%;
    }

    .menu a {
      margin: 25px 0 0 0px;
      width: 100%;
    }
  }

</style>

<div class="flex justify-between items-center menu relative whitespace-nowrap">
  <Search suggest={false} class="mx-4"/>
  <a href="/market"><button on:click={toggle}>Experiences</button></a>
  <a href="/faq"><button on:click={toggle}>FAQ</button></a>
  {#if $user}
    {#if $user.is_admin}
      <a href="/admin"><button on:click={toggle}>Admin</button></a>
    {/if}
    <a href={`/u/${$user.username}`}>
      <button on:click={toggle} class="flex">
        <Avatar user={$user} />
      </button></a>
  {:else}<a href="/login"><button on:click={toggle}>Sign In</button></a>{/if}
</div>
