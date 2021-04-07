<script>
  import { mutation, subscription, query, operationStore } from "@urql/svelte";
  import {
    getArtworksByArtist,
  } from "$queries/artworks";
  export let others;
  export let id;

  let o = { requestPolicy: "cache-and-network" };

  query(operationStore(getArtworksByArtist(id), {}, o)).subscribe(
    ({ data }) =>
      data &&
      data.artworks &&
      (others = data.artworks
        .filter((a) => artwork && a.id !== artwork.id)
        .slice(0, 4))
  );
</script>
