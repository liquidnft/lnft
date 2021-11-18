<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Form from "../_form.svelte";
  import { getArtwork } from "$queries/artworks";
  import { updateArtwork, updateTags } from "$queries/artworks";
  import { err, goto } from "$lib/utils";
  import { password, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { query } from "$lib/api";

  let { id } = $page.params;
  let artwork;

  onMount(async () => {
    await requireLogin();
    query(getArtwork(id))
      .then((res) => {
        artwork = res.artworks_by_pk;
      })
      .catch(err);
  });

  let update = async (e) => {
    e.preventDefault();

    let { id: artwork_id, description, filename, title, tags, package_content } = artwork;

    query(updateTags, {
      tags: tags.map(({ tag }) => ({ tag, artwork_id })),
      artwork_id,
    })
      .then(() => {
        query(updateArtwork, {
          artwork: { description, title, package_content },
          id,
        })
          .then(() => {
            goto(`/a/${artwork.slug}`);
          })
          .catch(err);
      })
      .catch(err);
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
