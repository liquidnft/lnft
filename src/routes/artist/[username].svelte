<script>
  import { query } from "$lib/api";
  import { page } from "$app/stores";
  import { getArtworksByUsername } from "$queries/artworks";
  import { Gallery } from "$comp";
  import { err } from "$lib/utils";

  let { username } = $page.params;
  let artworks = [];

  $: query(getArtworksByUsername(username))
    .then((res) => (artworks = res.artworks))
    .catch(err);

</script>

<div class="container mx-auto mt-10 md:mt-20">
  <h2 class="mb-10">{username}</h2>
  <Gallery {artworks} />
</div>
