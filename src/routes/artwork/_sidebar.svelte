<script>
  import { user, token } from "$lib/store";
  import Avatar from "$components/Avatar";
  import Eye from "$components/Eye";
  import Heart from "$components/Heart";
  import { toggleFavorite } from "$queries/favorites";
  export let artwork;

  let favorite = () => {
    toggleFavorite($token, artwork, $user.id);

    if (artwork.favorited) {
      artwork.favorites--;
      artwork.favorited = false;
    } else {
      artwork.favorites++;
      artwork.favorited = true;
    }
  };
</script>

<div class="w-full md:w-1/4">
    <a href={`/user/${artwork.artist_id}`}>
  <div class="flex mb-6">
    <Avatar src={artwork.artist.avatar_url} />
    <div class="ml-2 my-auto">
      <div>
        @{artwork.artist.username}
      </div>
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
