<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Form from "../_form";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import { password, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/utils";

  let { id } = $page.params;

  onMount(requireLogin);

  let artwork;
  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = b.artworks_by_pk;
  });

  const updateArtwork$ = mutation(updateArtwork);
  
  let update = async (e) => {
    e.preventDefault();

    let {
      id: artwork_id,
      description,
      filename,
      title,
    } = artwork;

    updateArtwork$({
      artwork: { description, filename, title },
      id,
    }).then(() => {
      goto(`/artwork/${artwork.id}`);
    });
  };

</script>

{#if artwork}
  <Form {artwork} on:submit={update} />
{/if}
