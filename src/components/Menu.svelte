<script>
  import { Avatar, Search } from "$comp";
  import { show, user, token } from "$lib/store";
  import branding from "$lib/branding";
  export let open = false;
  let toggle = () => (open = !open);
</script>

<style>
  .menu button {
    width: auto;
    text-align: left;
    padding: 0 20px;
  }
  .menu :global(.search) {
    border: 1px solid lightgray;
    border-radius: 30px;
    margin-right: 15px;
    width: 250px;
  }
  .menu :global(.search):focus-within {
    border: 1px solid #5c5d60;
    border-radius: 30px;
  }
  .menu :global(input) {
    width: auto;
    width: 80%;
    border: none;
    background: none;
    padding: 0.5rem 1.2rem;
  }
  .menu :global(.fa-search) {
    font-size: 1.2rem;
  }
  @media only screen and (max-width: 1023px) {
    .menu :global(.search) {
      display: none;
    }
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

<div class="flex justify-between items-center menu relative">
  <Search suggest={false} />
  <a sveltekit:prefetch href="/market"><button
      on:click={toggle}>Market</button></a>
  <a sveltekit:prefetch href="/activity"><button
      on:click={toggle}>Activity</button></a>
  <!--
  <a href="/galleries"><button on:click={toggle}>Galleries</button></a>
  -->
  <a href="https://junglelab.net/"><button on:click={toggle}>Blog</button></a>
  <a href="/faq"><button on:click={toggle}>FAQ</button></a>
  {#if $user}
    {#if $user.is_admin}
      <a href="/admin"><button on:click={toggle}>Admin</button></a>
    {/if}
    <a href={`/${$user.username}`}>
      <button on:click={toggle} class="flex">
        <Avatar user={$user} />
      </button></a>
  {:else}<a href="/login"><button on:click={toggle}>Sign In</button></a>{/if}
</div>