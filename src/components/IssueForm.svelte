<script>
  import Select from "svelte-select";
  import { gql } from "$components/api";
  import { token } from "$components/store";

  let artwork = {
    title: "",
    description: "",
    tags: [],
  };

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

    const response = await gql.auth(`Bearer ${$token}`).post(params);
    console.log(response);
  };

  const items = [
    { value: "chocolate", label: "Chocolate", group: "Sweet" },
    { value: "pizza", label: "Pizza", group: "Savory" },
    { value: "cake", label: "Cake", group: "Sweet" },
    { value: "chips", label: "Chips", group: "Savory" },
    { value: "ice-cream", label: "Ice Cream", group: "Sweet" },
  ];

  let handle = ({ detail }) => {
    let tags = { data: detail.map(({ value: tag}) => ({ tag })) };
    artwork = { ...artwork, tags };
  };
</script>

<style>
  input,
  textarea {
    @apply border p-4;
  }
</style>

<form
  class="w-full md:w-1/2 mb-6"
  on:submit|preventDefault={issue}
  autocomplete="off">
  <div class="flex flex-col mb-4">
    <input placeholder="Title" bind:value={artwork.title} />
  </div>
  <div class="flex flex-col mb-4">
    <textarea placeholder="Description" bind:value={artwork.description} />
  </div>
  <div class="flex flex-col mb-4">
    <Select {items} isMulti={true} placeholder="Tags" on:select={handle} />
  </div>
  <div class="flex">
    <button
      on:click|preventDefault={issue}
      class="block bg-teal-400 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
