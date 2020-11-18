<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";
  import Avatar from "$components/Avatar";
  import { getArtworks } from "$queries/artworks";
  import Card from "$components/Card";
  import Offers from "$components/Offers";

  let logout = () => {
    window.sessionStorage.removeItem("token");
    $token = null;
    goto("/login");
  };

  let collection = [];
  let creations = [];
  let favorites = [];

  onMount(async () => {
    let artworks = await getArtworks($token);
    creations = artworks.filter(a => a.artist_id === $user.id);
    collection = artworks.filter(a => a.owner_id === $user.id);
    favorites = artworks.filter(a => a.favorited);
  });

  let tab = 'creations';
</script>

<style>
  .hover {
    @apply border-b-2 border-black;
  }

  .tabs div {
    @apply mb-auto h-10 mx-4;
    &:hover {
      @apply hover;
    }
  }
</style>

{#if $user}
  <div class="flex mb-4 w-100">
    <div>
      <Avatar size="large" />

      <div class="my-4">
        <div>Followers: 0</div>
        <div>Following: 0</div>
      </div>

      <div class="mb-4">
        <button class="bg-black text-white p-2 rounded" on:click={() => goto(`/user/${$user.id}/edit`)}>Edit Profile</button>
      </div>

      <div class="mb-2 text-sm"><a href="/history">Download tx history</a></div>
      <div class="mb-2 text-sm"><a href="/wallet">View Wallet</a></div>
      <div class="mb-2 text-sm"><a href="/settings">Update Settings</a></div>
      <div class="text-sm cursor-pointer"><a on:click={logout} class="cursor-pointer">Sign Out</a></div>
    </div>
    <div class="mb-2 ml-2">
      <div class="text-3xl">{$user.full_name}</div>
      <div>Id: {$user.id}</div>
      <div class="text-gray-600">@{$user.username}</div>
    </div>
    <div class="w-1/2">
      <div class="flex justify-center text-center cursor-pointer tabs flex-wrap">
        <div class:hover={tab === 'creations'} on:click={() => tab = 'creations'}>Creations</div>
        <div class:hover={tab === 'collection'} on:click={() => tab = 'collection'}>Collection</div>
        <div class:hover={tab === 'offers'} on:click={() => tab = 'offers'}>Offers</div>
        <div class:hover={tab === 'favorites'} on:click={() => tab = 'favorites'}>Favorites</div>
      </div>
      {#if tab === 'creations'}
      <div class="w-100 flex justify-center">
        <div class="flex flex-wrap px-6">
          {#each creations as artwork (artwork.id)}
            <Card {artwork} columns="2" />
          {/each}
        </div>
      </div>
    {:else if tab === 'collection'}
      <div class="w-100 flex justify-center">
        <div class="flex flex-wrap px-6">
          {#each collection as artwork (artwork.id)}
            <Card {artwork} columns="2" />
          {/each}
        </div>
      </div>
    {:else if tab === 'offers'}
      <Offers />
    {:else}
      <div class="w-100 flex justify-center">
        <div class="flex flex-wrap px-6">
          {#each favorites as artwork (artwork.id)}
            <Card {artwork} columns="2" />
          {/each}
        </div>
      </div>
    {/if}
    </div>
  </div>
{/if}
