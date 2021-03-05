<script>
  import { user } from "$lib/store";
  import { createFavorite, deleteFavorite } from "$queries/favorites";
  import { mutation } from "@urql/svelte";
  import { requireLogin } from "$lib/auth";

  export let artwork;

  let favorited;
  $: artwork && ({favorited} = artwork);

  let stroke = favorited ? "red" : "black";
  let fill = favorited ? "red" : "none";

  let enter = () => {
    stroke = "red";
    fill = "red";
  };

  let leave = () => {
    if (!favorited) {
      stroke = "black";
      fill = "none";
    }
  };

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

<img src="/heart.png" class="w-8 h-8" alt={artwork.title} on:click={favorite} />
