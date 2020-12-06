<script>
  import { formatISO, addDays } from 'date-fns';
  export let artwork;
  export let tags = [];
  let selected;

  const allTags = ["digital", "glitch", "3d", "abstract"];
  $: artwork.tags = { data: tags.map((tag) => ({ tag })) };

  $: artwork.auction_end = formatISO(addDays(new Date(), 3));
</script>

<form class="w-full md:w-1/2 mb-6" on:submit autocomplete="off">
  <div class="flex flex-col mb-4">
    <input placeholder="Title" bind:value={artwork.title} />
  </div>
  <div class="flex flex-col mb-4">
    <textarea placeholder="Description" bind:value={artwork.description} />
  </div>
  <div class="flex flex-col mb-4">
    <div>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input
          class="form-input block w-full pl-7 pr-12"
          placeholder="0.00"
          bind:value={artwork.list_price} />
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
  <div class="flex flex-col mb-4">
    <input placeholder="Auction End Time" bind:value={artwork.auction_end} />
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
      type="submit"
      class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
