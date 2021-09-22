<script>
  import { assets, user } from "$lib/store";
  import { goto } from "$lib/utils";
  import Fa from "svelte-fa";
  import {
    faChevronLeft,
    faCog,
    faDollarSign,
  } from "@fortawesome/free-solid-svg-icons";
</script>

<style>
  .wallet-nav-container {
    position: absolute;
    z-index: 2;
    margin-left: 5%;
  }

  .wallet-nav {
    font-size: 15px;
  }

  .wallet-nav a {
    margin-bottom: 20px;
  }

  .wallet-nav a:hover {
    color: #3ba5ac;
  }

  @media (max-width: 1023px) {
    .wallet-nav-container {
      position: relative;
      margin-left: 0;
    }
    .wallet-nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10;
      background: white;
      box-shadow: 1px 1px 3px rgb(0 0 0 / 100%);
    }

    .wallet-nav a {
      display: flex;
      width: 100%;
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding: 12px 0;
      border-left: 1px solid lightgray;
      margin-bottom: 0;
    }
  }
</style>

{#if $user}
  <div class="wallet-nav-container">
    <h2 class="mb-5 px-5 md:px-0"><a href="/wallet">Wallet</a></h2>

    <div class="wallet-nav flex flex-col uppercase">
      <a href={`/u/${$user.username}`}>
        <div
          class="flex flex-wrap justify-center sm:justify-start items-center sm:items-start h-full">
          <Fa icon={faChevronLeft} class="my-auto mr-2" />
          <div class="sm:hidden">Profile</div>
          <div class="hidden sm:block">Back to profile</div>
        </div>
      </a>
      <!-- Due to new feature (click on asset name to change the asset) we don't need this anymore -->
      <!--{#if $assets.length > 1}-->
      <!--  <a href="/wallet/asset">-->
      <!--    <div-->
      <!--      class="flex flex-wrap justify-center sm:justify-start items-center sm:items-start h-full">-->
      <!--      <Fa icon={faDollarSign} class="my-auto mr-2" />-->
      <!--      <div class="sm:hidden">Asset</div>-->
      <!--      <div class="hidden sm:block">Change asset</div>-->
      <!--    </div>-->
      <!--  </a>-->
      <!--{/if}-->
      <a href="/wallet/setup">
        <div
          class="flex flex-wrap justify-center sm:justify-start items-center sm:items-start h-full">
          <Fa icon={faCog} class="my-auto mr-2" />
          <div>Settings</div>
        </div>
      </a>
    </div>
  </div>
{/if}
