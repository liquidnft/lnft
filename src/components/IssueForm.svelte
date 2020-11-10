<script>
  import Multiselect from "$components/Multiselect";
  import { gql } from "$components/api";
  import { token } from "$components/store";

  let title;
  let description;

  let params = {
    query: `mutation insert_single_artwork($object: artworks_insert_input!) {
  insert_artworks_one(object: $object) {
  id
  }
  }`,
    variables: {
      object: {
        title: "Article 1",
        description: "Sample article content",
        owner_id: "10b2de5b-0ba6-4da7-b2ba-b665175a51cb",
        artist_id: "10b2de5b-0ba6-4da7-b2ba-b665175a51cb",
      },
    },
  };

  let issue = async (e) => {
    const response = await gql.auth(`Bearer ${$token}`).post(params);
    console.log(response);
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
    <input placeholder="Title" bind:value={title} />
  </div>
  <div class="flex flex-col mb-4">
    <textarea placeholder="Description" bind:value={description} />
  </div>
  <div class="flex flex-col mb-4">
    <Multiselect />
  </div>
  <div class="flex">
    <button
      on:click|preventDefault={issue}
      class="block bg-teal-400 hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
