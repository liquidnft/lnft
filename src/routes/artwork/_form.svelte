<script>
  import { page } from "$app/stores";
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  export let artwork;
  let input;
  let items;

  $: focus($page);
  export let focus = (p) => p && tick().then(() => input.select());

  $: selectedValue = artwork.tags.map(({ tag }) => ({
    value: tag,
    label: tag,
  }));

  subscription(operationStore(`subscription { tags { tag } }`), (a, b) => {
    items = [...new Set(b.tags.map((t) => t.tag))].map((value) => ({
      value,
      label: value,
    }));
  });

  let handle = ({ detail }) => {
    artwork.tags = detail.map(({ value: tag }) => ({ tag }));
  };
</script>

<style>
  input, select, textarea{ 
    @apply rounded-lg;
  }

  label{
    @apply mb-4;
  }

</style>

<form class="flex gap-5 flex-col w-full mb-6 mt-20" on:submit autocomplete="off">
  <div class="flex flex-col mb-4">
    <input
      class="border-0 border-b-2 rounded-none"
      placeholder="What's your artwork title?"
      bind:value={artwork.title}
      bind:this={input} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Ticker</label>
    <input placeholder="Ticker" bind:value={artwork.ticker} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Description</label>
    <textarea placeholder="How would you describe it?" bind:value={artwork.description} />
  </div>
  {#if !artwork.id}
    <div class="flex flex-col mb-4">
      <label>Number of editions</label>
      <input placeholder="Editions" bind:value={artwork.editions} />
    </div>
  {/if}
  <div class="flex flex-col mb-4">
    <label>Tags <span class="text-gray-400">(e.g. Abstract, monochromatic, etc)</span></label>
    <Select
      {items}
      isMulti={true}
      placeholder="Tags"
      on:select={handle}
      {selectedValue}
      isCreatable={true} />
  </div>
  <div class="flex justify-end">
    <button
      type="submit"
      class="primary-btn">Submit</button>
  </div>
</form>
