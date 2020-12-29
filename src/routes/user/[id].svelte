<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { goto }  from "$app/navigation";
  import { Avatar, Card, Offers, ProgressLinear } from "$comp";
  import { getArtworks } from "$queries/artworks";
  import { getUser } from "$queries/users";
  import { createFollow, deleteFollow } from "$queries/follows";
  import Menu from "./_menu";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { fade } from "svelte/transition";
  import { requireLogin } from "$lib/utils";

  export let id;

  requireLogin($token);

  let collection = [];
  let creations = [];
  let favorites = [];

  let artworks;
  subscription(operationStore(getArtworks), (_, data) => {
    artworks = data.artworks;
  }
);

  let subject;
  subscription(operationStore(getUser(id)), (_, data) => {
    subject = data.users_by_pk;
  });

  $: applyFilters(artworks, subject);

  let updateSubject = async (data) => {
    if (!data) return;
  };

  let applyFilters = (artworks, subject) => {
    if (!(artworks && subject)) return;
    creations = artworks.filter((a) => a.artist_id === subject.id);
    collection = artworks.filter((a) => a.owner_id === subject.id);
    favorites = artworks.filter((a) => a.favorited);
  };

  let follow, toggleFollow$;
  $: if (subject && $user) {
    if (subject.followed) {
      toggleFollow$ = mutation(deleteFollow($user, subject));

      follow = () => {
        toggleFollow$();
        subject.followed = false;
        subject.num_followers--;
      };
    } else {
      toggleFollow$ = mutation(createFollow(subject));

      follow = () => {
        toggleFollow$();
        subject.followed = true;
        subject.num_followers++;
      };
    }
  }

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

  .card-container {
    width: 44% !important;
    margin: 3%;
  }

  .follow {
    width: 150px;
  }

  .profile-container .col1 {
    width: 10%;
    min-width: 150px;
  }

  .profile-container .col2 {
    width: 20%;
    min-width: 150px;
    margin-right: 20%;
  }

  .profile-container .col3 {
    width: 50%;
  }

  @media only screen and (max-width: 1280px) {
    .profile-container .col2 {
      margin-right: 5%;
    }

    .profile-container .col3 {
      width: 65%;
    }
  }

  @media only screen and (max-width: 1023px) {
    .card-container {
      width: 100% !important;
    }
  }

  @media only screen and (max-width: 800px) {
    .profile-container {
      flex-wrap: wrap;
    }

    .profile-container .col3 {
      width: 100%;
      margin-top: 40px;
    }
  }
</style>

{#if $user && subject}
  <div class="flex profile-container" in:fade>
    <div class="col1">
      <Avatar size="large" src={subject.avatar_url} />

      <div class="my-4">
        <div>Followers: {subject.num_followers}</div>
        <div>Following: {subject.num_follows}</div>
      </div>

      {#if $user.id === id}
        <Menu />
      {:else}
        <button
          class="bg-black text-white p-2 rounded brand-color follow"
          on:click={follow}>
          {subject.followed ? 'Unfollow' : 'Follow'}</button>
      {/if}
    </div>
    <div class="col2">
      <div class="text-3xl">{subject.full_name}</div>
      <div class="text-gray-600">@{subject.username}</div>
    </div>
    <div class="col3">
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
              <div class="card-container">
                <Card {artwork} />
              </div>
            {:else}
              <div class="mx-auto">No creations yet</div>
            {/each}
          </div>
        </div>
      {:else if tab === 'collection'}
        <div class="w-full flex justify-center">
          <div class="w-full flex flex-wrap">
            {#each collection as artwork (artwork.id)}
              <div class="card-container">
                <Card {artwork} />
              </div>
            {:else}
              <div class="mx-auto">Nothing collected yet</div>
            {/each}
          </div>
        </div>
      {:else if tab === 'offers'}
        <Offers />
      {:else}
        <div class="w-full flex justify-center">
          <div class="w-full flex flex-wrap">
            {#each favorites as artwork (artwork.id)}
              <div class="card-container">
                <Card {artwork} />
              </div>
            {:else}
              <div class="mx-auto">No favorites yet</div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="absolute top-0 w-full left-0">
    <ProgressLinear />
  </div>
{/if}
