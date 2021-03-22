<script>
  import { user } from "$lib/store";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { mutation } from "@urql/svelte";
  import { requireLogin } from "$lib/auth";

  import Fa from "svelte-fa";
  import { faHeart } from "@fortawesome/free-regular-svg-icons";
  import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

  export let artwork;

  let { favorited } = artwork;

  let createFavorite$ = mutation(createFavorite);
  let deleteFavorite$ = mutation(deleteFavorite);

  let favorite = async () => {
    await requireLogin();
    let { id: artwork_id } = artwork;
    let { id: user_id } = $user;

    if (favorited) {
      deleteFavorite$({ artwork_id, user_id });
      artwork.num_favorites--;
      favorited = false;
    } else {
      createFavorite$({ artwork_id });
      artwork.num_favorites++;
      favorited = true;
    }
  };
</script>

<style>
  div:hover,
  .favorited {
    @apply text-primary cursor-pointer;
  }
</style>

<div
  on:click={favorite}
  class:favorited
  >
  <Fa icon={favorited ? solidHeart : faHeart} size="1.5x" />
</div>
