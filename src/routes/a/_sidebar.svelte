<script>
  import Fa from "svelte-fa";
  import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
  import { Avatar, Eye, Heart } from "$comp";
  import { explorer, goto } from "$lib/utils";

  export let artwork;
  let showDetails = false;

</script>

<style>
  :global(.description a) {
    color: #3ba5ac;
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
</style>
<div class="mt-6">
  <div class="mb-6">
    {#each artwork.tags.map((t) => t.tag) as tag (tag)}
      <a
        href={`/tag/${tag}`}
        class="secondary-color text-sm font-bold uppercase mr-5">#{tag}</a>{' '}
    {/each}
  </div>

    <div
      class="text-xs my-6 cursor-pointer"
      on:click={() => (showDetails = !showDetails)}>
      <div class="flex">
        <div>Asset details</div>
        <div class="my-auto ml-1">
          <Fa icon={showDetails ? faChevronUp : faChevronDown} />
        </div>
      </div>
    </div>

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
</div>
