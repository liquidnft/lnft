<script>
  import { page } from "$app/stores";
  import { getArtworksByUsername } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import Gallery from "$components/Gallery";

  let { username } = $page.params;
  let artworks = [];
  subscription(
    operationStore(getArtworksByUsername(username)),
    (a, b) => (artworks = b.artworks)
  );
</script>

<div class="container mx-auto flex flex-wrap sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-10">{username}</h2>
  <Gallery {artworks} />
</div>
