<script>
  import { user } from "$lib/store";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { requireLogin } from "$lib/auth";
  import { err } from "$lib/utils";
  import { query } from "$lib/api";
  import Fa from "svelte-fa";
  import { faHeart } from "@fortawesome/free-regular-svg-icons";
  import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

  export let artwork;

  // vars for style-guide to manage appearance
  export let active = false;
  export let hovered = false;

  let { favorited } = artwork;

  let favorite = async () => {
    try {

      await requireLogin();
      let { id: artwork_id } = artwork;
      let { id: user_id } = $user;

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

<style lang="scss">

  .default {
    // nothing
  }

  .hovered {
    // hovered state
    @apply cursor-pointer;
  }

  .active {
    @apply cursor-pointer;
  }

  div:hover,
  .favorited {
    @apply cursor-pointer;
  }
</style>

<div
    class="{$$props.class}"
    on:click={favorite}
    class:favorited
    class:hovered
>
  <Fa icon={favorited || active ? solidHeart : faHeart} size="1.5x" />
</div>
