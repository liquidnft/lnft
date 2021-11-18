<script>
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

  const dispatch = createEventDispatcher();

  export let title = "PNG, GIF, MP4. Max 100mb.";
  export let style = "box";

  let fileInput;
  let highlight;

  let drop = (e) => {
    stop(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    dispatch("file", dt.files[0]);
  };

  let start = (e) => {
    e.preventDefault();
    highlight = true;
  };

  let stop = (e) => {
    e.preventDefault();
    highlight = false;
  };

  let open = (e) => {
    fileInput.click();
  };

</script>


{#if style === 'box'}
  <div
      id="drop-area"
      on:dragenter={start}
      on:dragover={start}
      on:dragleave={stop}
      on:focus={start}
      on:mouseover={start}
      on:blur={stop}
      on:mouseout={stop}
      on:drop={drop}
      class:highlight>

    <div class="text-black">
      <div class="mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center relative p-4">
        <div>PNG, GIF, MP4. Max 100mb</div>
        <input
            bind:this={fileInput}
            type="file"
            id="fileElem"
            multiple
            accept="image/*,video/*"
            class="absolute opacity-0 w-full h-full top-0 left-0 right-0 bottom-0 cursor-pointer"
            on:change={(e) => dispatch('file', e.target.files[0])}
        />

        <div class="rounded-full bg-gray-200 px-4 py-2 cursor-pointer text-sm color-gray-500 mt-4">Choose file</div>
      </div>
    </div>
  </div>
{:else}
  <a
    href="."
    on:click|preventDefault={open}
    class="secondary-color cursor-pointer">
    <div class="flex">
      <div>{title}</div>
      <div class="ml-1 my-auto">
        <Fa icon={faCloudUploadAlt} />
      </div>
    </div>
  </a>
  <form class="text-center invisible">
    <div class="flex justify-center flex-col align-center h-full">
      <span class="uppercase">{title}</span>
      <Fa icon={faCloudUploadAlt} />
    </div>
    <input
      bind:this={fileInput}
      type="file"
      id="fileElem"
      multiple
      accept="image/*,video/*"
      on:change={(e) => dispatch('file', e.target.files[0])} />
  </form>
{/if}
