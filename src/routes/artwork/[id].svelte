<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import Card from "$components/Card";
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { getArtwork } from "$queries/artworks";
  import goto from "$lib/goto";
  import { gql } from "$lib/api";

  export let id;

  let artwork;
  onMount(async () => {
    artwork = await getArtwork($token, id);
  });

  let favorite = async (e) => {
    if (artwork.favorited) {
      let params = {
        query: `mutation delete_favorite {
          delete_favorites_by_pk(artwork_id: "${artwork.id}", user_id: "${$user.id}") {
            user_id
            artwork_id
          } 
        }`,
      };

      artwork.favorites--;
      artwork.favorited = false;
      await gql.auth(`Bearer ${$token}`).post(params);
    } else {
      let params = {
        query: `mutation insert_favorites_one {
          insert_favorites_one(object: { artwork_id: "${artwork.id}" }) {
            user_id,
            artwork_id
          } 
        }`,
      };

      artwork.favorites++;
      artwork.favorited = true;
      await gql.auth(`Bearer ${$token}`).post(params);
    }
  };
</script>

<style>
  button {
    @apply mb-2 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded;
    &:hover {
      @apply bg-teal-200;
    }
  }
</style>

{#if artwork}
  <div class="flex flex-wrap md:flex-no-wrap">
    <div class="text-center md:text-left w-1/4">
      <h1 class="text-3xl font-black text-gray-900">{artwork.title}</h1>
      <div class="font-black mb-6">Edition 1 of 1</div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-teal-600 text-xs">#{tag}</a>{' '}
        {/each}
      </div>

      {#if artwork.list_price}<button>Buy Now</button>{/if}
      <button>Place a Bid</button>
    </div>
    <Card {artwork} />
    <div class="w-1/4">
      <div class="flex mb-6">
        <Avatar />
        <div class="ml-2 my-auto">
          <div><a href={`/user/${artwork.artist_id}`}>@{artwork.artist.username}</a></div>
          <div class="text-xs text-gray-600">Artist</div>
        </div>
      </div>
      <div class="flex mb-6">
        <Avatar />
        <div class="ml-2 my-auto">
          <div><a href={`/user/${artwork.owner_id}`}>@{artwork.owner.username}</a></div>
          <div class="text-xs text-gray-600">Owner</div>
        </div>
      </div>

      <hr class="mb-4" />
      <div class="flex mb-4">
        <div class="w-1/3 flex">
          <Heart on:click={favorite} favorited={artwork.favorited} />
        </div>
        <div class="w-2/3">
          <div>{artwork.favorites}</div>
          <div class="text-xs text-gray-600">Favorites</div>
        </div>
      </div>
      <div class="flex">
        <div class="w-1/3 flex">
          <div class="my-auto mt-3">
            <Eye />
          </div>
        </div>
        <div class="w-2/3">
          <div>6</div>
          <div class="text-xs text-gray-600">Views</div>
        </div>
      </div>
    </div>
  </div>
{/if}
