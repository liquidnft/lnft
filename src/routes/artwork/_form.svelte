<script>
  import { err } from "$lib/utils";
  import { query } from "$lib/api";
  import Fa from "svelte-fa";
  import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
  import { page } from "$app/stores";
  import { tick } from "svelte";
  import Select from "svelte-select";
  import { onMount } from "svelte";
  import Button from "$styleguide/components/Button.svelte";

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
  export let focus = (p) => p && tick().then(() => input && input.select());

  $: selectedValue = artwork.tags.map(({ tag }) => ({
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
    <label for="title">Experience Title</label>
    <input
      id="title"
      class="border-0 border-b-2"
      style="border-radius: 0 !important"
      placeholder="Title"
      on:input={({ target: { value } }) => debounce(value)}
      bind:this={input} />
  </div>
  <div class="flex flex-col mb-6">
    <label for="description">Description</label>
    <textarea
      id="description"
      placeholder="How would you describe it?"
      bind:value={artwork.description} />
  </div>
  <div class="flex flex-col mb-6">
    <label for="title">Package Content</label>
    <input
      id="title"
      class="border-0 border-b-2"
      style="border-radius: 0 !important"
      placeholder="Title"
      on:input={({ target: { value } }) => debounce(value)}
      bind:this={input} />
  </div>
  <div class="flex w-full">
    <Button primary class="w-full">Submit experience</Button>
  </div>
</form>
