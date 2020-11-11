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
  import { token } from "$components/store";
  import { gql } from "$components/api";

  export let id;

  let artwork;
  onMount(() => {
    let params = {
      query: `query {
        artworks_by_pk(id: "${id}") {
          id,
          title,
          description,
          artist_id,
          artist {
            display_name
          },
          owner {
            display_name
          },
          filename,
          tags {
            tag
          } 
        }
      }`,
    };

    gql
      .auth(`Bearer ${$token}`)
      .post(params)
      .json(({ data }) => (artwork = data.artworks_by_pk));
  });
</script>

{#if artwork}
  <div class="flex flex-wrap md:flex-no-wrap">
    <div class="text-center md:text-left w-1/4">
      <h1 class="text-3xl font-black text-gray-900">{id}</h1>
      <div class="font-black mb-6">Edition 1 of 1</div>
      <div class="text-sm text-gray-600">{artwork.description}</div>
      <div class="mb-6">
        {#each artwork.tags.map((t) => t.tag) as tag (tag)}
          <a
            href={`/tag/${tag}`}
            class="underline text-teal-600 text-xs">#{tag}</a>
        {/each}
      </div>

      <button
        class="mb-2 hover:bg-teal-200 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded">Buy
        Now</button>
      <button
        class="hover:bg-teal-200 border border-black w-full uppercase text-sm font-bold py-2 px-4 rounded">Place
        a Bid</button>
    </div>
    <Card {artwork} />
    <div class="w-1/4">
      <div class="flex mb-6">
        <Avatar />
        <div class="ml-2 my-auto">
          <div>@{artwork.artist.display_name}</div>
          <div class="text-xs text-gray-600">Artist</div>
        </div>
      </div>
      <div class="flex mb-6">
        <Avatar />
        <div class="ml-2 my-auto">
          <div>@{artwork.owner.display_name}</div>
          <div class="text-xs text-gray-600">Owner</div>
        </div>
      </div>

      <hr class="mb-4" />
      <div class="flex mb-4">
        <div class="w-1/3 flex">
          <Heart />
        </div>
        <div class="w-2/3">
          <div>2</div>
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
