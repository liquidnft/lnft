<script>
  import Select from "svelte-select";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  export let artwork;
  let items;

  $: selectedValue = artwork.tags.map(({ tag }) => ({ value: tag, label: tag }))

  subscription(operationStore(`subscription { tags { tag } }`), (a, b) => {
    items = [...new Set(b.tags.map(t => t.tag))].map((value) => ({ value, label: value }));
  });

  let handle = ({ detail }) => {
    artwork.tags = detail.map(({ value: tag }) => ({ tag }))
  };
</script>

<form class="w-full md:w-1/2 mb-6" on:submit autocomplete="off">
  <div class="flex flex-col mb-4">
    <label>Title</label>
    <input placeholder="Title" bind:value={artwork.title} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Description</label>
    <textarea placeholder="Description" bind:value={artwork.description} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Editions</label>
    <input placeholder="Editions" bind:value={artwork.editions} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Tags</label>
    <Select
      {items}
      isMulti={true}
      placeholder="Tags"
      on:select={handle}
      {selectedValue}
      isCreatable={true} />
  </div>
  <div class="flex">
    <button
      type="submit"
      class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
