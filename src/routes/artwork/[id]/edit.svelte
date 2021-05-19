<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Form from "../_form";
  import { getArtwork } from "$queries/artworks";
  import { mutation, subscription, operationStore } from "@urql/svelte";
  import { updateArtwork, updateTags } from "$queries/artworks";
  import { goto } from "$lib/utils";
  import { password, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/auth";

  let { id } = $page.params;

  onMount(requireLogin);

  let artwork;
  subscription(operationStore(getArtwork(id)), (a, b) => {
    artwork = b.artworks_by_pk;
    console.log(artwork);
  });

  const updateArtwork$ = mutation(updateArtwork);
  const updateTags$ = mutation(updateTags);
  let update = async (e) => {
    e.preventDefault();

    let {
      id: artwork_id,
      description,
      filename,
      title,
      tags,
    } = artwork;

    updateTags$({
      tags: tags.map(({ tag }) => ({ tag, artwork_id })),
      artwork_id,
    }).then(() => {
      updateArtwork$({
        artwork: { description, title },
        id,
      }).then(() => {
        goto(`/a/${artwork.slug}`);
      });
    });
  };
</script>

<div class="container mx-auto md:p-20">
  <div class="w-full max-w-4xl mx-auto bg-white md:p-10 rounded-xl">
    {#if artwork}
      <a class="block mb-6 text-midblue" href={`/a/${artwork.slug}`}>
        <div class="flex">
          <Fa icon={faChevronLeft} class="my-auto mr-1" />
          <div>Back</div>
        </div>
      </a>
    {/if}
    <h2>Edit artwork</h2>
    {#if artwork}
      <Form bind:artwork title={artwork.title} on:submit={update} />
    {/if}
  </div>
</div>
