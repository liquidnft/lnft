<script>
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import { explorer, goto } from "$lib/utils";
  import { requireLogin } from "$lib/auth";

  export let artwork;
  let showDetails = false;
</script>

<style>
  hr {
    margin: 50px 0;
  }

  @media only screen and (max-width: 1023px) {
    .sidebar {
      width: 100%;
      padding: 0;
    }
  }
</style>

<div class="flex flex-wrap justify-between text-left">
  <a href={`/${artwork.artist.username}`}>
    <div class="flex mb-6">
      <Avatar user={artwork.artist} />
      <div class="ml-2 secondary-color">
        <div>@{artwork.artist.username}</div>
        <div class="text-xs text-gray-600">Artist</div>
      </div>
    </div>
  </a>
  <a href={`/${artwork.owner.username}`}>
    <div class="flex mb-6 secondary-color">
      <Avatar user={artwork.owner} key={artwork.owner.username} />
      <div class="ml-2">
        <div>@{artwork.owner.username}</div>
        <div class="text-xs text-gray-600">Owner</div>
      </div>
    </div>
  </a>
</div>

<div class="mb-6">
  {#each artwork.tags.map((t) => t.tag) as tag (tag)}
    <a
      href={`/tag/${tag}`}
      class="secondary-color text-sm font-bold uppercase mr-5">#{tag}</a>{' '}
  {/each}
</div>
<div class="text-sm text-gray-600">{artwork.description}</div>

{#if !showDetails}
  <div
    class="text-xs my-6 cursor-pointer"
    on:click={() => (showDetails = true)}>
    View asset details
    <i class="fas fa-chevron-down ml-2" />
  </div>
{/if}

{#if showDetails}
  <div class="text-sm text-gray-600 break-all mt-6 mb-2">
    <div class="text-xs">Liquid Asset Id</div>
    <a
      href={`${explorer}/asset/${artwork.asset}`}
      class="secondary-color">{artwork.asset}</a>
  </div>

  <div class="text-sm text-gray-600 break-all mb-6">
    <div class="text-xs">IPFS Hash</div>
    <a
      href={`https://ipfs.io/ipfs/${artwork.filename}`}
      class="secondary-color">{artwork.filename}</a>
  </div>
{/if}

<div class="flex flex-wrap justify-between mb-10">
  <div class="flex">
    <Heart {artwork} />
    <div class="w-2/3 ml-4">
      <div>{artwork.num_favorites}</div>
      <div class="text-xs text-gray-600">Favorites</div>
    </div>
  </div>
  <div class="flex">
    <div class="w-1/3 flex mr-4">
      <div class="my-auto mt-3">
        <Eye />
      </div>
    </div>
    <div class="w-2/3">
      <div>{artwork.views}</div>
      <div class="text-xs text-gray-600">Views</div>
    </div>
  </div>
</div>
