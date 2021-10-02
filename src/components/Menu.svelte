<script>
  import { Avatar, Search } from "$comp";
  import { show, user, token } from "$lib/store";
  import { logout } from "$lib/auth";

  export let open = false;
  let toggle = () => (open = !open);
</script>

<style>
  .menu button {
    font-size: 15px;
    width: auto;
    text-align: left;
    font-family: "Oswald-bold";
    color: #000;
    text-transform: uppercase;
  }

  .menu a {
    padding: 0 20px;
  }

  .menu button:hover {
    border-bottom: 1px solid #000;
  }

  .menu a.no-underline button {
    border-bottom: none;
  }

  .menu .signin {
    width: 120px;
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

  @media screen and (max-width: 1200px) {
    .menu a {
      padding: 0 10px;
      font-size: 16px;
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
      margin: 20px 0 0 20px;
      font-family: "Oswald-bold";
    }
    .menu .search {
      margin: 40px 0 0 45px;
    }
  }

</style>

<div class="flex justify-between items-center menu relative">
  <a href="https://www.nftglee.com/about-us/"><button on:click={toggle}>About Us</button></a>
  <a href="/market"><button on:click={toggle}>New Drops</button></a>
  <a href="https://www.nftglee.com/goldenwhalepass/"><button
      on:click={toggle}>Our Work</button></a>
  {#if $user}
    <a href="/contact"><button on:click={toggle}>Contact Us</button></a>
    {#if $user.is_admin}
      <a href="/admin"><button on:click={toggle}>Admin</button></a>
    {/if}
    <a href={`/u/${$user.username}`}>
      <button on:click={toggle} class="flex">
        <Avatar user={$user} />
      </button></a>
  {:else}
    <a href="/login"><button on:click={toggle}>Log In</button></a>
    <a href="/register"><button on:click={toggle}>Sign Up</button></a>
    <a href="/contact"><button on:click={toggle}>Contact Us</button></a>
  {/if}
</div>
