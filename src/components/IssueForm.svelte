<script>
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { gql } from "$components/api";
  import { token } from "$components/store";
  import { goto } from "/_app/main/runtime/navigation";

  export let filename;

  let artwork = {
    title: "",
    description: "",
    filename,
    tags: {},
  };

  let error = "";

  let issue = async (e) => {
    let params = {
      query: `mutation insert_single_artwork($artwork: artworks_insert_input!) {
      insert_artworks_one(object: $artwork) {
        id
      }
    }`,
      variables: {
        artwork,
      },
    };

    gql
      .auth(`Bearer ${$token}`)
      .post(params)
      .json((res) => {
        if (res.errors) {
          res.errors.map((e) => (error += e.message));
        } else {
          goto("/");
        }
      });
  };

  const allTags = ["digital", "glitch", "3d", "abstract"];
  let tags = [];
  $: artwork.tags = { data: tags.map(tag => ({ tag })) }
</script>

<style>
  input,
  textarea,
  select {
    @apply border p-4;
    overflow-y: auto;
  }
</style>

<form
  class="w-full md:w-1/2 mb-6"
  on:submit|preventDefault={issue}
  autocomplete="off">
  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  <div class="flex flex-col mb-4">
    <input placeholder="Title" bind:value={artwork.title} />
  </div>
  <div class="flex flex-col mb-4">
    <textarea placeholder="Description" bind:value={artwork.description} />
  </div>
  <div class="flex flex-col mb-4">
    <select multiple bind:value={tags}>
      <option disabled>Tags</option>
      {#each allTags as tag}
        <option value={tag}>{tag}</option>
      {/each}
    </select>
  </div>
  <div class="flex">
    <button
      on:click|preventDefault={issue}
      class="block bg-teal-400 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
