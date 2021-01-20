<script>
  import { user, token } from "$lib/store";
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { mutation } from "@urql/svelte";
  import { goto }  from "$lib/utils";

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
  .sidebar{
    width: 25%;
    padding:0 5%;
  }

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

<div class="">
  <a href={`/user/${artwork.artist_id}`}>
    <div class="flex mb-6">
      <Avatar src={artwork.artist.avatar_url} />
      <div class="ml-2 my-auto">
        <div>@{artwork.artist.username}</div>
        <div class="text-xs text-gray-600">Artist</div>
      </div>
    </div>
  </a>
  <a href={`/user/${artwork.owner_id}`}>
    <div class="flex mb-6">
      <Avatar src={artwork.owner.avatar_url} />
      <div class="ml-2 my-auto">
        <div>@{artwork.owner.username}</div>
        <div class="text-xs text-gray-600">Owner</div>
      </div>
    </div>
  </a>

  <hr class="mb-4" />
  <div class="flex mb-4">
    <div class="w-1/3 flex">
      <Heart on:click={favorite} favorited={artwork.favorited} />
    </div>
    <div class="w-2/3">
      <div>{artwork.num_favorites}</div>
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
