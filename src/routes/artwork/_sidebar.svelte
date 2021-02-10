<script>
  import { user, token } from "$lib/store";
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { mutation } from "@urql/svelte";
  import { explorer, goto }  from "$lib/utils";

  export let artwork;

  let createFavorite$ = mutation (createFavorite);
  let deleteFavorite$ = mutation (deleteFavorite);

  let favorite = () => {
    if (!$user) return goto('/login');
    let { id: artwork_id } = artwork;
    let { id: user_id } = $user;

    if (artwork.favorited) {
      deleteFavorite$({ artwork_id, user_id });
      artwork.num_favorites--;
      artwork.favorited = false;
    } else {
      createFavorite$({ artwork_id });
      artwork.num_favorites++;
      artwork.favorited = true;
    }
  };
</script>

<style>
  hr{
    margin: 50px 0;
  }

  @media only screen and (max-width: 1023px){
    .sidebar{
      width: 100%;
      padding: 0;
    }
  }
</style>


  <div class="flex flex-wrap justify-between gap-10 text-left">
    <a href={`/user/${artwork.artist_id}`}>
      <div class="flex mb-6">
        <Avatar src={artwork.artist.avatar_url} />
        <div class="ml-2 secondary-color">
          <div>@{artwork.artist.username}</div>
          <div class="text-xs text-gray-600">Artist</div>
        </div>
      </div>
    </a>
    <a href={`/user/${artwork.owner_id}`}>
      <div class="flex mb-6 secondary-color">
        <Avatar src={artwork.owner.avatar_url} />
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

  <div class="text-sm text-gray-600 break-all mb-6">
    IPFS:
    <a
      href={`https://ipfs.io/ipfs/${artwork.filename}`}
      class="secondary-color">{artwork.filename}</a>
  </div>

  <div class="text-sm text-gray-600 break-all mb-6">
    Asset Id:
    <a
      href={`${explorer}/asset/${artwork.asset}`}
      class="secondary-color">{artwork.asset}</a>
  </div>
 

  <div class="flex flex-wrap justify-between gap-10 mb-10">
    <div class="flex gap-5">
      <div class="w-1/3 flex">
        <Heart on:click={favorite} favorited={artwork.favorited} />
      </div>
      <div class="w-2/3">
        <div>{artwork.num_favorites}</div>
        <div class="text-xs text-gray-600">Favorites</div>
      </div>
    </div>
    <div class="flex gap-5">
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

