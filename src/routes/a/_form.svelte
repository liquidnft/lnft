<script>
  import { browser } from "$app/env";
  import { err } from "$lib/utils";
  import { query } from "$lib/api";
  import Fa from "svelte-fa";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
  import { page } from "$app/stores";
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { onMount } from "svelte";

  export let artwork;
  export let title;

  let input, items, loading, timer;

  const debounce = (v) => {
    loading = true;
    artwork.title = v;
    artwork.ticker = "";
    clearTimeout(timer);
    timer = setTimeout(() => {
      title = v;
      loading = false;
    }, 550);
  };

  onMount(() => {
    if (artwork.title) input.value = artwork.title;
    query(`query { tags { tag } }`)
      .then(
        (res) =>
          (items = [...new Set(res.tags.map((t) => t.tag))].map((value) => ({
            value,
            label: value,
          })))
      )
      .catch(err);
  });

  $: focus($page);
  export let focus = (p) => browser && p && tick().then(() => input && input.select());

  $: value = artwork.tags.map(({ tag }) => ({
    value: tag,
    label: tag,
  }));

  let handle = ({ detail }) => {
    artwork.tags = detail.map(({ value: tag }) => ({ tag }));
  };

</script>

<style>
  .tooltip {
    cursor: pointer;
  }
  .tooltip .tooltip-text {
    display: none;
    padding: 15px;
    position: absolute;
    z-index: 100;
    width: 300px;
    font-style: normal;
  }
  .tooltip:hover .tooltip-text {
    display: block;
  }
  input[type="checkbox"]:checked {
    appearance: none;
    border: 5px solid #fff;
    outline: 2px solid #6ed8e0;
    background-color: #6ed8e0;
    padding: 2px;
    border-radius: 0;
  }

  input,
  textarea {
    @apply rounded-lg;
  }

</style>

<form class="flex flex-col w-full mb-6 mt-20" on:submit autocomplete="off">
  <div class="flex flex-col mb-6">
    <input
      class="border-0 border-b-2"
      style="border-radius: 0 !important"
      placeholder="What's your artwork title?"
      on:input={({ target: { value } }) => debounce(value)}
      bind:this={input} />
  </div>
  <div class="toggle mb-6">
    <label for="physical" class="inline-flex items-center">
      <input
        id="physical"
        class="form-checkbox h-6 w-6"
        type="checkbox"
        bind:checked={artwork.is_physical} />
      <span class="ml-3">This is a physical artwork</span>
    </label>
  </div>
  {#if !artwork.id}
    <div class="flex flex-col mb-6">
      <label for="editions">Number of editions</label>
      <input
        id="editions"
        placeholder="Editions"
        bind:value={artwork.editions}
        class="w-1/2" />
    </div>
  {/if}
  <div class="flex flex-col mb-6">
    <label for="description">Description</label>
    <textarea
      id="description"
      placeholder="How would you describe it?"
      bind:value={artwork.description} />
  </div>
  {#if !artwork.id}
    <div class="flex flex-col mb-6">
      <div class="mb-0">
        <label for="ticker" class="flex">
          <div class="mr-2">Ticker</div>
          <div class="mt-1 mb-0">
            <span class="tooltip">
              <i class="text-midblue text-xl">
                <Fa icon={faQuestionCircle} />
              </i>
              <span class="tooltip-text bg-gray-100 shadow ml-4 rounded">The
                ticker is a short 3-5 character identifier for your asset that
                you'll see in other wallets and explorers.</span>
            </span>
          </div>
        </label>
      </div>
      <input
        id="ticker"
        class="w-1/2"
        bind:value={artwork.ticker}
        maxlength="5" />
    </div>
  {/if}
  <div class="flex flex-col mb-6">
    <label for="tags">Tags
      <span class="text-gray-400">(e.g. Abstract, monochromatic, etc)</span></label>
    <Select
      id="tags"
      {items}
      isMulti={true}
      placeholder="Tags"
      on:select={handle}
      {value}
      isCreatable={true} />
  </div>
  <div class="flex">
    <button type="submit" class="primary-btn">Submit</button>
  </div>
</form>
