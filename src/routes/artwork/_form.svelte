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
  <div class="flex flex-col mb-4">
    <div>
      <div class="mt-1 relative rounded-md shadow-sm">
        <label>List Price</label>
        <input
          class="form-input block w-full pl-7 pr-12"
          placeholder="0"
          bind:value={artwork.list_price} />
        <div class="absolute inset-y-0 right-0 flex items-center mr-2">
          <select
            aria-label="Currency"
            class="border-transparent bg-transparent text-gray-500 p-0">
            <option>SAT</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col mb-4">
    <label>Auction End Time</label>
    <input placeholder="Auction End Time" bind:value={artwork.auction_end} />
  </div>
  <div class="flex">
    <button
      type="submit"
      class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
