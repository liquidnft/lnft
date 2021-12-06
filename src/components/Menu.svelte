<script>
  import { Avatar, Search } from "$comp";
  import { show, user, token } from "$lib/store";
  import { logout } from "$lib/auth";

  export let open = false;
  let toggle = () => (open = !open);

  let dropdown;
  let showDropdown = () => (dropdown = true);
  let hideDropdown = () => (dropdown = false);

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
      margin-top: 80px;
      width: 100%;
    }

    .menu a {
      margin: 25px 0 0 0px;
      width: 100%;
    }
  }

</style>

<div class="flex justify-between items-center menu relative" on:mouseout={hideDropdown}>
  <a
    href="/agriculture"
    style="color: #83e68d"
    on:mouseover={showDropdown}><button
      on:click={toggle}>Marketplace</button></a>
    <div class="lg:absolute lg:mt-40 " class:lg:hidden={!dropdown} on:mouseover={showDropdown}>
      <div>
        <a href="/agriculture" style="color: #83e68d"><button
            on:click={toggle}>Agriculture</button></a>
      </div>
      <div>
        <a href="/real-estate" style="color: #83e68d"><button
            on:click={toggle}>Real Estate</button></a>
      </div>
      <div>
        <a href="/music" style="color: #83e68d"><button
            on:click={toggle}>Music</button></a>
      </div>
      <div>
        <a href="/vehicles" style="color: #83e68d"><button
            on:click={toggle}>Vehicles</button></a>
      </div>
    </div>
  <a href="/about" style="color: #83e68d" on:mouseover={hideDropdown}><button
      on:click={toggle}>About</button></a>
  <a href="/faq" style="color: #83e68d"><button on:click={toggle}>What's an NFT?</button></a>
  {#if $user}
    {#if $user.is_admin}
      <a href="/admin"><button on:click={toggle}>Admin</button></a>
    {/if}
    <a href={`/${$user.username}`}>
      <button on:click={toggle} class="flex">
        <Avatar user={$user} />
      </button></a>
  {:else}
    <a href="/login" style="color: #83e68d"><button on:click={toggle}>Sign In</button></a>
  {/if}
</div>
