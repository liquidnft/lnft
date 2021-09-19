<script>
  import Search from "$styleguide/components/Search";
  import WalletPopup from "$styleguide/components/WalletPopup";
  import Fa from "svelte-fa";
  import { faWallet, faUser } from "@fortawesome/free-solid-svg-icons";
  import { user } from "$lib/store";
  import {clickOutside} from '$lib/svelte-actions';

  export let open = false;
  let toggle = () => (open = !open);

  let hovering;
  let enter = () => (hovering = true);
  let leave = () => (hovering = false);

  // wallet handler

  let walletToggleHandler;
  let displayWallet = false;
  let toggleWallet = () => {
    displayWallet = !displayWallet;
  };

  function handleWalletClickOutside(e) {
    if(displayWallet) {
      if(walletToggleHandler !== e.detail.target && !walletToggleHandler.contains(e.detail.target)) {
        displayWallet = false;
      }
    }
  }
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

    .menu :global(.search) {
      display: none;
    }

  }
</style>

<div class="flex justify-between items-center menu relative whitespace-nowrap">
  <Search suggest={false} class="mx-4"/>
  <a class="menu-link" href="/market"><button on:click={toggle}>Experiences</button></a>
  <a class="menu-link" href="/faq"><button on:click={toggle}>FAQ</button></a>

  {#if $user}
    {#if $user.is_admin}
      <a class="menu-link" href="/admin"><button on:click={toggle}>Admin</button></a>
    {/if}
    <div class="relative flex hidden lg:flex">
      <button class="toggleWallet" on:click={toggleWallet} bind:this={walletToggleHandler}>
        <Fa icon={faWallet} size="1.5x"/>
      </button>
      <div use:clickOutside on:clickOutside={handleWalletClickOutside}>
        <WalletPopup visible={displayWallet}/>
      </div>
    </div>
    <a href={`/u/${$user.username}`} class="hidden lg:inline-block">
      <button on:click={toggle} class="flex">
        <Fa icon={faUser} size="1.5x"/>
      </button>
    </a>
  {:else}
    <a href="/login" class="menu-link"><button on:click={toggle}>Sign In</button></a>
  {/if}
</div>
