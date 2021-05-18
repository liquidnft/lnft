<script>
  import Fa from "svelte-fa";
  import {
    faEnvelope,
    faLink,
    faMapMarkerAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { goto } from "$lib/utils";
  import { Avatar, Card, Offers, ProgressLinear } from "$comp";
  import { getUserArtworks } from "$queries/artworks";
  import { getUserById } from "$queries/users";
  import { createFollow, deleteFollow } from "$queries/follows";
  import Menu from "./_menu";
  import { query, mutation, subscription, operationStore } from "@urql/svelte";
  import { fade } from "svelte/transition";
  import { requireLogin } from "$lib/auth";

  export let id;
  export let subject;

  $: pageChange($page);

  const pageChange = ({ params }) => {
    if (params.id) ({ id } = params);
    else ({ id } = subject);
  };

  let collection = [];
  let creations = [];
  let favorites = [];

  let artworks;
  $: if (id)
    query(operationStore(getUserArtworks(id))).subscribe(
      ({ data }) => data && (artworks = data.artworks)
    );

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
  .gallery-tab :global(.card-link img),
  .gallery-tab :global(.card-link video) {
    height: 350px;
  }

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
            {#if subject.instagram}
              <a href={`https://instagram.com/${subject.instagram}`}>
                <div class="flex">
                  <div class="my-auto">
                    <Fa icon={faInstagram} />
                  </div>
                  <div><span>@{subject.instagram}</span></div>
                </div>
              </a>
            {/if}
            {#if subject.twitter}
              <a href={`https://twitter.com/${subject.twitter}`}>
                <div class="flex">
                  <div class="my-auto">
                    <Fa icon={faTwitter} />
                  </div>
                  <div><span>@{subject.twitter}</span></div>
                </div>
              </a>
            {/if}
            {#if subject.email}
              <a href={`mailto:${subject.email}`}>
                <div class="flex">
                  <div class="my-auto">
                    <Fa icon={faEnvelope} />
                  </div>
                  <div><span>{subject.email}</span></div>
                </div>
              </a>
            {/if}
            {#if subject.website}
              <a href={`https://${subject.website}`}>
                <div class="flex">
                  <div class="my-auto">
                    <Fa icon={faLink} />
                  </div>
                  <div><span>{subject.website}</span></div>
                </div>
              </a>
            {/if}
            {#if subject.location}
              <a href="#">
                <div class="flex">
                  <div class="my-auto">
                    <Fa icon={faMapMarkerAlt} />
                  </div>
                  <div><span>{subject.location}</span></div>
                </div>
              </a>
            {/if}
          </div>
          {#if subject.bio}
            <p>{subject.bio}</p>
          {/if}
          <div>
            {#if $user.id === subject.id}
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
          <div class="w-full justify-center">
            <div class="w-full flex flex-wrap">
              {#each creations as artwork (artwork.id)}
                <div class="gallery-tab w-full lg:w-1/2 px-5 mb-10">
                  <Card {artwork} />
                </div>
              {:else}
                <div class="mx-auto">No creations yet</div>
              {/each}
            </div>
            <div class="w-1/2 mx-auto mb-4 mt-0">
              {#if $user && $user.is_artist && $user.id === subject.id}
                <a href="/artwork/create" class="primary-btn">Submit a new
                  artwork</a>
              {/if}
            </div>
          </div>
        {:else if tab === 'collection'}
          <div class="w-full flex justify-center">
            <div class="w-full flex flex-wrap">
              {#each collection as artwork (artwork.id)}
                <div class="gallery-tab w-full lg:w-1/2 px-5 mb-10">
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
                <div class="gallery-tab w-full lg:w-1/2 px-0 md:px-5 mb-10">
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
