<script>
  import { page } from "$app/stores";
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { mutation, subscription, operationStore } from "@urql/svelte";

  export let artwork;
  let input;
  let items;

  $: focus($page);
  let focus = (p) => p && tick().then(() => input.select());

  $: selectedValue = artwork.tags.map(({ tag }) => ({
    value: tag,
    label: tag,
  }));

  let managedItems = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  subscription(operationStore(`subscription { tags { tag } }`), (a, b) => {
    items = [...new Set(b.tags.map((t) => t.tag))].map((value) => ({
      value,
      label: value,
    }));
  });

  let handle = ({ detail }) => {
    artwork.tags = detail.map(({ value: tag }) => ({ tag }));
  };

  let handleManaged = ({ detail }) => {
    artwork.managed = detail.value;
  };
</script>

<form class="w-full md:w-1/2 mb-6" on:submit autocomplete="off">
  <div class="flex flex-col mb-4">
    <label>Title</label>
    <input
      placeholder="Title"
      bind:value={artwork.title}
      bind:this={input} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Ticker</label>
    <input placeholder="Ticker" bind:value={artwork.ticker} />
  </div>
  <div class="flex flex-col mb-4">
    <label>Description</label>
    <textarea placeholder="Description" bind:value={artwork.description} />
  </div>
  {#if !artwork.id}
    <div class="flex flex-col mb-4">
      <label>Editions</label>
      <input placeholder="Editions" bind:value={artwork.editions} />
    </div>
  {/if}
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
  <div class="flex flex-col mb-4">
    <label>Managed</label>
    <Select
      items={managedItems}
      placeholder="Managed"
      on:select={handleManaged}
      selectedValue={managedItems.find((i) => i.value === artwork.managed)} />
  </div>
  <div class="flex">
    <button
      type="submit"
      class="block bg-green-400 hover:bg-green-dark text-white uppercase text-lg mx-auto p-4 rounded flex-1">Submit</button>
  </div>
</form>
