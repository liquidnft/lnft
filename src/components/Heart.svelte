<script>
  import { session } from "$app/stores";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { requireLogin } from "$lib/auth";
  import { err } from "$lib/utils";
  import { query } from "$lib/api";

  import Fa from "svelte-fa";
  import { faHeart } from "@fortawesome/free-regular-svg-icons";
  import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

  export let artwork;

  let { favorited } = artwork;

  let favorite = async () => {
    try {
      await requireLogin(null, $session.jwt);
      let { id: artwork_id } = artwork;
      let { id: user_id } = $session.user;

      if (favorited) {
        await query(deleteFavorite, { artwork_id, user_id });
        artwork.num_favorites--;
        favorited = false;
      } else {
        await query(createFavorite, { artwork_id });
        artwork.num_favorites++;
        favorited = true;
      }
    } catch (e) {
      err(e);
    }
  };
</script>

<div on:click={favorite} class:favorited>
  <Fa icon={favorited ? solidHeart : faHeart} size="1.5x" />
</div>

<style>
  div:hover,
  .favorited {
    @apply text-primary cursor-pointer;
  }
</style>
