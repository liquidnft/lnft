<script>
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { gql } from "$lib/api";
  import { token } from "$lib/store";
  import goto from "$lib/goto";
  import { createArtwork } from "$queries/artworks";

  export let filename;

  let artwork = {
    title: "",
    description: "",
    filename,
    tags: {},
  };

  let error = "";

  let issue = async (e) => {
    createArtwork($token, artwork).json(() => {
      goto('/');
    });
  };

  const allTags = ["digital", "glitch", "3d", "abstract"];
  let tags = [];
  $: artwork.tags = { data: tags.map((tag) => ({ tag })) };
</script>

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
    <div>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input
          class="form-input block w-full pl-7 pr-12"
          placeholder="0.00" 
          bind:value={artwork.list_price}
        />
        <div class="absolute inset-y-0 right-0 flex items-center mr-2">
          <select
            aria-label="Currency"
            class="border-transparent bg-transparent text-gray-500 p-0">
            <option>BTC</option>
            <option selected>mBTC</option>
            <option>SATS</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div>
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
  </div>
</form>
