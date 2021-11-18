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
  import FormItem from './components/_form-item.svelte';
  import Input from '$styleguide/components/Input.svelte';
  import Textarea from '$styleguide/components/Textarea.svelte';

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

  // $: focus($page);
  // export let focus = (p) => p && tick().then(() => input && input.select());

  let selectedValue;
  $: selectedValue = artwork.tags.map(({ tag }) => ({
    value: tag,
    label: tag,
  }));

  const tagsSelect = ({ detail }) => {
    if(detail === null) {
      artwork.tags = [];
    } else {
      artwork.tags = detail.map(({ value: tag }) => ({ tag }));
    }
  };

  const TYPES = {
    FIXED  : 'FIXED',
    AUCTION: 'AUCTION',
  };

  let listingType = TYPES.FIXED;

  function selectListingType(type) {
    return () => {
      listingType = type;
    }
  }

</script>

<style lang="scss">
  .sell-type {
    svg {
      path {
        fill: #000;
      }
    }
    &.active {
      @apply bg-black text-white;
      svg {
        path {
          fill: #fff;
        }
      }
    }
  }
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

  :global(.selectContainer) {
    background: transparent !important;
    @apply text-sm appearance-none h-12 rounded-md bg-gray-100 border border-gray-300 mt-2 w-full #{!important};
  }

</style>

<form class="flex flex-col w-full mb-6 mt-20" on:submit autocomplete="off">

  <!-- Artwork title -->

  <div class="py-2">
    <FormItem title="Experience title">
      <Input bind:value={artwork.title} placeholder="Title"/>
    </FormItem>
  </div>

  <!-- Artwork description -->

  <div class="py-2">
    <FormItem title="Experience description">
      <Textarea bind:value={artwork.description} placeholder="Description"/>
    </FormItem>
  </div>

  <!-- Artwork tags -->

  <div class="py-2">
    <FormItem title="Tags">
      <Select
          id="tags"
          {items}
          isMulti={true}
          placeholder="Tags"
          on:select={tagsSelect}
          {selectedValue}
          isCreatable={true} />
    </FormItem>
  </div>

  <div class="py-2">
    <FormItem title="Editions">
      <Input bind:value={artwork.editions} placeholder="Number of editions (by default it is 1)"/>
    </FormItem>
  </div>

  <div class="py-2">
    <FormItem title="Package content">
      <Textarea bind:value={artwork.package_content} placeholder="Describe what is included in experience"/>
    </FormItem>
  </div>

  <hr class="my-4"/>

  <div class="py-4">
    <FormItem title="Sell on marketplace">
      <div class="grid gap-8 grid-cols-2 py-4">
        <div>
          <div on:click={selectListingType(TYPES.FIXED)} class:active={listingType === TYPES.FIXED} class="sell-type cursor-pointer text-center mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center">
            <svg class="w-12 h-12 mb-4" viewBox="0 0 59.997 59.997" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M59.206,0.293c-0.391-0.391-1.023-0.391-1.414,0L54.084,4H30.802L1.532,33.511c-0.667,0.666-1.034,1.553-1.034,2.495  s0.367,1.829,1.034,2.495l20.466,20.466c0.687,0.687,1.588,1.03,2.491,1.03c0.906,0,1.814-0.346,2.508-1.04l28.501-29.271V5.414  l3.707-3.707C59.596,1.316,59.596,0.684,59.206,0.293z M23.412,57.553L2.946,37.087c-0.289-0.289-0.448-0.673-0.448-1.081  s0.159-0.792,0.451-1.084l8.85-8.923l22.545,22.546l-8.771,9.008C24.978,58.148,24.008,58.148,23.412,57.553z M53.499,28.874  L35.74,47.112L13.208,24.579L31.635,6h20.45l-4.833,4.833C46.461,10.309,45.516,10,44.499,10c-2.757,0-5,2.243-5,5s2.243,5,5,5  s5-2.243,5-5c0-1.017-0.309-1.962-0.833-2.753l4.833-4.833V28.874z M47.499,15c0,1.654-1.346,3-3,3s-3-1.346-3-3s1.346-3,3-3  c0.462,0,0.894,0.114,1.285,0.301l-1.992,1.992c-0.391,0.391-0.391,1.023,0,1.414C43.987,15.902,44.243,16,44.499,16  s0.512-0.098,0.707-0.293l1.992-1.992C47.385,14.106,47.499,14.538,47.499,15z"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>
            Fixed Price
          </div>
        </div>
        <div>
          <div on:click={selectListingType(TYPES.AUCTION)} class:active={listingType === TYPES.AUCTION} class="sell-type cursor-pointer text-center mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center">
            <svg class="w-12 h-12 mb-4" viewBox="0 0 100.4 100.4" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M56.6,16.5v-4.4h4.1c0.8,0,1.5-0.7,1.5-1.5V3.4c0-0.8-0.7-1.5-1.5-1.5H43.2c-0.8,0-1.5,0.7-1.5,1.5v7.2   c0,0.8,0.7,1.5,1.5,1.5h4.1v4.4c-9.7,1.1-18.3,5.6-24.8,12.2L20.8,27l2.8-2.8c0.6-0.6,0.6-1.5,0-2.1l-5.8-5.8   c-0.6-0.6-1.5-0.6-2.1,0L7.8,24c-0.6,0.6-0.6,1.5,0,2.1l5.8,5.8c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l2.9-2.9l1.9,1.9   C14.6,38,11,47.2,11,57.2c0,22.6,18.4,41,41,41s41-18.4,41-41C92.9,36.2,77,18.8,56.6,16.5z M14.7,28.8L11,25l5.6-5.6l3.7,3.7   l-2.2,2.2c-0.3,0.3-0.7,0.7-1.1,1.1L14.7,28.8z M48.8,9.1h-4.1V4.9h14.5v4.2h-4.1c-0.8,0-1.5,0.7-1.5,1.5v5.7c-0.5,0-1.1,0-1.6,0   s-1.1,0-1.6,0v-5.7C50.3,9.7,49.6,9.1,48.8,9.1z M51.9,95.2c-20.9,0-38-17-38-38s17-38,38-38c0.8,0,1.6,0,2.4,0.1   c0.4,0,0.8,0.1,1.2,0.1c19.3,1.8,34.4,18.1,34.4,37.8C89.9,78.2,72.9,95.2,51.9,95.2z"/><path d="M73.5,32.6c-0.1-0.1-0.2-0.2-0.3-0.3c-5.7-4.9-13.1-7.8-21.2-7.8c-18.1,0-32.7,14.7-32.7,32.7S33.9,90,51.9,90   s32.7-14.7,32.7-32.7C84.7,47.4,80.3,38.6,73.5,32.6z M51.9,87c-16.4,0-29.7-13.3-29.7-29.7s13.3-29.7,29.7-29.7   c6.9,0,13.2,2.4,18.2,6.3L53.9,52.5c-0.6-0.2-1.3-0.4-1.9-0.4c-2.8,0-5.1,2.3-5.1,5.1s2.3,5.1,5.1,5.1s5-2.3,5-5.1   c0-1-0.3-2-0.8-2.8l16.3-18.7c5.7,5.4,9.2,13,9.2,21.5C81.7,73.6,68.3,87,51.9,87z M54,57.2c0,1.2-0.9,2.1-2.1,2.1   s-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1S54,56.1,54,57.2z"></path></g></svg>
            Time auction<br/>
            English - Dutch auction
          </div>
        </div>
      </div>
    </FormItem>
  </div>

  <div>
    <div class="grid gap-8 grid-cols-2 py-4">
      <div>
        <FormItem title="Minimum bid">
          <Input placeholder="Minimum bid"/>
        </FormItem>
        <div class="mt-4">
          <ul class="text-sm list-disc ml-4">
            <li>
              We take a 10% commission on the sale, take that<br/>
              into consideration when listing your experience
            </li>
            <li class="mt-2">
              1% will be donated to charity.<br/>
              Our goal is to give back to the community
            </li>
          </ul>
        </div>
      </div>
      <div>
        <FormItem title="Start date">
          <Input placeholder="For e.g. 10.09.2021 10:40"/>
        </FormItem>
        <FormItem title="End date" class="mt-4">
          <Input placeholder="For e.g. 10.09.2021 10:40"/>
        </FormItem>
      </div>
    </div>
  </div>

  <hr class="my-4"/>

  <div class="grid gap-8 grid-cols-2 py-4">
    <div>
      <FormItem title="Royalties">
        <Input placeholder="%"/>
        <div class="text-sm mt-2 text-gray-400">
          Recommended: 10%. Max: 50%
        </div>
      </FormItem>
    </div>
  </div>

  <Button type="submit" primary class="w-full mt-8">Submit an experience</Button>
<!--  <Button primary class="w-full mt-8" on:click={submit}>Submit an experience</Button>-->

<!--  <div class="flex flex-col mb-6">-->
<!--    <label for="title">Experience Title</label>-->
<!--    <input-->
<!--      id="title"-->
<!--      class="border-0 border-b-2"-->
<!--      style="border-radius: 0 !important"-->
<!--      placeholder="Title"-->
<!--      on:input={({ target: { value } }) => debounce(value)}-->
<!--      bind:this={input} />-->
<!--  </div>-->
<!--  <div class="flex flex-col mb-6">-->
<!--    <label for="description">Description</label>-->
<!--    <textarea-->
<!--      id="description"-->
<!--      placeholder="How would you describe it?"-->
<!--      bind:value={artwork.description} />-->
<!--  </div>-->
<!--  <div class="flex flex-col mb-6">-->
<!--    <label for="title">Package Content</label>-->
<!--    <input-->
<!--      id="title"-->
<!--      class="border-0 border-b-2"-->
<!--      style="border-radius: 0 !important"-->
<!--      placeholder="Title"-->
<!--      on:input={({ target: { value } }) => debounce(value)}-->
<!--      bind:this={input} />-->
<!--  </div>-->
<!--  <div class="flex w-full">-->
<!--    <Button primary class="w-full" type="submit">Submit experience</Button>-->
<!--  </div>-->
</form>
