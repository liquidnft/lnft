<script context="module">
  export async function load({ fetch, page, session }) {
    const props = await fetch(`/artworks/${page.params.slug}.json`).then((r) =>
      r.json()
    );

    if (!(session && session.user)) return {
      status: 302,
      redirect: '/login'
    } 

    return {
      maxage: 90,
      props,
    };
  }

</script>

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

  export let artwork;

  let update = async (e) => {
    e.preventDefault();

    let { id, description, filename, title, tags } = artwork;

    query(updateTags, {
      tags: tags.map(({ tag }) => ({ tag, artwork_id: id })),
      artwork_id: id,
    })
      .then(() => {
        query(updateArtwork, {
          artwork: { description, title },
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
      <a class="block mb-6 text-midblue" href={`/a/${artwork.slug}`}>
        <div class="flex">
          <Fa icon={faChevronLeft} class="my-auto mr-1" />
          <div>Back</div>
        </div>
      </a>
    <h2>Edit artwork</h2>
      <Form bind:artwork title={artwork.title} on:submit={update} />
  </div>
</div>
