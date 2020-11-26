<script context="module">
  export async function preload({ params }) {
    let { id } = params;

    return { id };
  }
</script>

<script>
  import Form from "../_form";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork, updateTags } from "$queries/artworks";
  import goto from "$lib/goto";

  export let id;

  let result = subscription(operationStore(getArtwork(id)));
  $: artwork = $result.data ? $result.data.artworks_by_pk : null;

  const updateArtwork$ = mutation(updateArtwork);
  const updateTags$ = mutation(updateTags);
  let update = async (e) => {
    e.preventDefault();

    let {
      id: artwork_id,
      description,
      filename,
      list_price,
      title,
      tags,
    } = artwork;

    updateTags$({
      tags: tags.data.map(({ tag }) => ({ tag, artwork_id })),
      artwork_id,
    }).then(() => {
      updateArtwork$({
        artwork: { description, filename, list_price, title },
        id,
      }).then(() => {
        goto(`/artwork/${artwork.id}`);
      });
    });
  };
</script>

{#if artwork}
  <Form {artwork} tags={artwork.tags.map((t) => t.tag)} on:submit={update} />
{/if}
