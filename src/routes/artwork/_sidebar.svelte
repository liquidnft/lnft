<script>
  import Fa from "svelte-fa";
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import { explorer, goto } from "$lib/utils";
  import { requireLogin } from "$lib/auth";

  export let artwork;
  let showDetails = false;

  function linkify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }
</script>

<style>
  :global(.description a) {
    color: #3ba5ac;
  }

  hr {
    margin: 50px 0;
  }

  .art-likes-container {
    display: flex;
    margin: 30px 0;
  }

  .art-likes {
    display: flex;
    align-items: center;
    margin-right: 15%;
  }

  .art-likes p {
    margin-left: 8px;
  }

  @media only screen and (max-width: 1023px) {
    .sidebar {
      width: 100%;
      padding: 0;
    }
  }
</style>

<div class="flex flex-wrap justify-between text-left">
  <a href={`/u/${artwork.artist.username}`}>
    <div class="flex mb-6">
      <Avatar user={artwork.artist} />
      <div class="ml-2 secondary-color">
        <div>@{artwork.artist.username}</div>
        <div class="text-xs text-gray-600">Artist</div>
      </div>
    </div>
  </a>
  <a href={`/u/${artwork.owner.username}`}>
    <div class="flex mb-6 secondary-color">
      <Avatar user={artwork.owner} />
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

<div class="description text-sm text-gray-600 whitespace-pre-wrap break-words">
  {@html linkify(artwork.description)}
</div>

{#if !showDetails}
  <div
    class="text-xs my-6 cursor-pointer"
    on:click={() => (showDetails = true)}>
    <div class="flex">
      <div>View asset details</div>
      <div class="my-auto ml-1">
        <Fa icon={faChevronDown} />
      </div>
    </div>
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

<div class="art-likes-container">
  <div class="art-likes">
    <Heart {artwork} />
    <p>{artwork.num_favorites}</p>
  </div>
  <div class="art-likes">
    <Eye />
    <p>{artwork.views}</p>
  </div>
</div>
