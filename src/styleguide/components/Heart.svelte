<script>
  import { user } from "$lib/store";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { mutation } from "@urql/svelte";
  import { requireLogin } from "$lib/auth";

  import Fa from "svelte-fa";
  import { faHeart } from "@fortawesome/free-regular-svg-icons";
  import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

  export let artwork;

  // vars for style-guide to manage appearance
  export let active = false;
  export let hovered = false;

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
