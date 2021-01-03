<script>
  import { formatISO, addDays } from 'date-fns';
  export let artwork;
  let selected;

  // const allTags = ["digital", "glitch", "3d", "abstract"];
  $: artwork.auction_end = formatISO(addDays(new Date(), 3));
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
  <div class="flex">
    <button
      type="submit"
      class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
