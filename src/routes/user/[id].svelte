<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { goto } from "$lib/utils";
  import { Avatar, Card, Offers, ProgressLinear } from "$comp";
  import { getArtworks } from "$queries/artworks";
  import { getUser } from "$queries/users";
  import { createFollow, deleteFollow } from "$queries/follows";
  import Menu from "./_menu";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { fade } from "svelte/transition";
  import { requireLogin } from "$lib/auth";

  let id;
  $: pageChange($page);

  const pageChange = async ({ params }) => {
    await requireLogin();
    ({ id } = params);
  };

  let subject;
  $: subscription(operationStore(getUser(id)), (_, data) => {
    subject = data.users_by_pk;
  });

  let collection = [];
  let creations = [];
  let favorites = [];

  let artworks;
  $: subject && subscription(operationStore(getArtworks), (_, data) => {
    artworks = data.artworks;
  });


  $: applyFilters(artworks, subject);

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
    @apply border-b-2;
    border-bottom: 3px solid #6ed8e0;
  }

  .tabs div {
    @apply mb-auto h-10 mx-2 md:mx-4;
    &:hover {
      @apply hover;
    }
  }

  .social-details {
    display: flex;
    flex-direction: column;
    margin: 25px 0;
  }
  .social-details a {
    margin-top: 15px;
  }

  .social-details a:hover,
  .social-details span:hover {
    color: gray;
  }

  .social-details span {
    margin-left: 8px;
    color: #0f828a;
  }
</style>

<div class="container mx-auto lg:px-16 mt-5 md:mt-20">
  {#if $user && subject}
    <div class="flex justify-between flex-wrap" in:fade>
      <div class="w-full xl:w-1/3 xl:max-w-xs mb-20">
        <div>
          <div class="flex flex-col">
            <div class="flex items-center">
              <Avatar size="large" src={subject.avatar_url} />
              <div class="ml-12">
                <h3>{subject.full_name}</h3>
                <div class="text-gray-600">@{subject.username}</div>
              </div>
            </div>
            <div class="flex mt-5">
              <div class="mr-8">Followers: {subject.num_followers}</div>
              <div>Following: {subject.num_follows}</div>
            </div>
          </div>
          <div class="social-details">
            {#if $user.instagram}
              <a href={`https://instagram.com/${$user.instagram}`}>
                <i class="fab fa-instagram" />
                <span>@{$user.instagram}</span>
              </a>
            {/if}
            {#if $user.twitter}
              <a href={`https://twitter.com/${$user.twitter}`}>
                <i class="fab fa-twitter" />
                <span>@{$user.twitter}</span>
              </a>
            {/if}
            {#if $user.email}
              <a href={`mailto:${$user.email}`}>
                <i class="far fa-envelope" />
                <span>{$user.email}</span>
              </a>
            {/if}
            {#if $user.website}
              <a href={`https://${$user.website}`}>
                <i class="fas fa-link" />
                <span>{$user.website}</span>
              </a>
            {/if}
            {#if $user.location}
              <a href="#">
                <i class="fas fa-map-marker-alt" />
                <span>{$user.location}</span>
              </a>
            {/if}
          </div>
          {#if $user.bio}
            <p>{$user.bio}</p>
          {/if}
          <div>
            {#if $user.id === id}
              <Menu />
            {:else}
              <button class="p-2 primary-btn follow mt-8" on:click={follow}>
                {subject.followed ? 'Unfollow' : 'Follow'}</button>
            {/if}
          </div>
        </div>
      </div>

      <div class="w-full xl:w-2/3">
        <div
          class="flex justify-center text-center cursor-pointer tabs flex-wrap mb-14">
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
            <div
              class:hover={tab === 'offers'}
              on:click={() => (tab = 'offers')}>
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
                <div class="w-full lg:w-1/2 px-5 mb-10">
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
                <div class="w-full lg:w-1/2 px-5 mb-10">
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
                <div class="w-full lg:w-1/2 px-0 md:px-5 mb-10">
                  <Card {artwork} showDetails={false} />
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
    <ProgressLinear app={true} />
  {/if}
</div>
