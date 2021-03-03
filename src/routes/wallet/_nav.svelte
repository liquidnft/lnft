<script>
  import { assets, user } from "$lib/store";
  import { goto } from "$lib/utils";
</script>

<style>

  .wallet-nav a{
    margin-bottom: 20px;
  }

  .wallet-nav span{
    margin-left: 10px;
  }

  .wallet-nav a:hover{
    color: #3ba5ac;
  }

  @media (max-width: 1023px) { 
    .wallet-nav{
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

    .wallet-nav a{
      display: flex;
      width: 100%;
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding: 12px 0;
      border-left: 1px solid lightgray;
      margin-bottom: 0;
    }

    .wallet-nav span{
      margin: 5px;
    }
  }

</style>


{#if $user}
<div class="text-left w-full lg:w-1/4 uppercase">
  <h2 class="mb-5"><a href="/wallet">Wallet</a></h2>

  <div class="wallet-nav flex flex-col">
    <a href={`/user/${$user.id}`}>
      <i class="fas fa-chevron-left"></i>
      <span>Back to Profile</span>
    </a>
    {#if $assets.length > 1}
    <a href="/wallet/asset">
      <i class="fas fa-dollar-sign"></i>
      <span>Change Asset</span>
    </a>
  {/if}
    <a href="/wallet/setup">
      <i class="fas fa-cog"></i>
      <span>Settings</span>
    </a>
  </div>
</div>
{/if}
