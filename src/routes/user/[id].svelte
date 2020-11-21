<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";
  import Avatar from "$components/Avatar";
  import { getArtworks } from "$queries/artworks";
  import { getUser } from "$queries/users";
  import { toggleFollow } from "$queries/follows";
  import Card from "$components/Card";
  import Offers from "$components/Offers";
  import Menu from "./_menu";
  import { query } from "@urql/svelte";

  export let id;

  let collection = [];
  let creations = [];
  let favorites = [];
  let subject;

  query(getArtworks);

  $: initialize(id, $getArtworks.data);

  let initialize = async (id, data) => {
    let artworks = data ? data.artworks : [];
    subject = await getUser($token, id);
    creations = artworks.filter((a) => a.artist_id === subject.id);
    collection = artworks.filter((a) => a.owner_id === subject.id);
    favorites = artworks.filter((a) => a.favorited);
  };

  let follow = async () => {
    await toggleFollow($token, subject, $user);
    subject = await getUser($token, id);
  };

  let tab = "creations";
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

{#if $user && subject}
  <div class="flex flex-wrap mb-4 w-full">
    <div class="md:w-1/6">
      <Avatar size="large" src={subject.avatar_url} />

      <div class="my-4">
        <div>Followers: {subject.num_followers}</div>
        <div>Following: {subject.num_follows}</div>
      </div>

      {#if $user.id === id}
        <Menu />
      {:else}
        <button
          class="bg-black text-white p-2 rounded"
          on:click={follow}>
          {subject.followed ? 'Unfollow' : 'Follow'}</button>
      {/if}
    </div>
    <div class="mb-2 md:w-1/3">
      <div class="text-3xl">{subject.full_name}</div>
      <div class="text-gray-600">@{subject.username}</div>
    </div>
    <div class="md:w-1/2">
      <div
        class="flex justify-center text-center cursor-pointer tabs flex-wrap mb-4">
        <div
          class:hover={tab === 'creations'}
          on:click={() => (tab = 'creations')}>
          Creations
        </div>
        <div
          class:hover={tab === 'collection'}
          on:click={() => (tab = 'collection')}>
          Collection
        </div>
        {#if $user.id === id}
          <div class:hover={tab === 'offers'} on:click={() => (tab = 'offers')}>
            Offers
          </div>
          <div
            class:hover={tab === 'favorites'}
            on:click={() => (tab = 'favorites')}>
            Favorites
          </div>
        {/if}
      </div>
      {#if tab === 'creations'}
        <div class="w-full flex justify-center">
          <div class="w-full flex flex-wrap">
            {#each creations as artwork (artwork.id)}
              <Card {artwork} columns="2" />
            {:else}
              <div>No creations yet</div>
            {/each}
          </div>
        </div>
      {:else if tab === 'collection'}
        <div class="w-full flex justify-center">
          <div class="w-full flex flex-wrap">
            {#each collection as artwork (artwork.id)}
              <Card {artwork} columns="2" />
            {:else}
              <div>Nothing collected yet</div>
            {/each}
          </div>
        </div>
      {:else if tab === 'offers'}
        <Offers />
      {:else}
        <div class="w-full flex justify-center">
          <div class="w-full flex flex-wrap">
            {#each favorites as artwork (artwork.id)}
              <Card {artwork} columns="2" />
            {:else}
              <div>No favorites yet</div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
