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

<style>
  #fileElem {
    position: fixed;
    top: -100em;
  }

  #drop-area {
    cursor: pointer;
    border: 1px solid gray;
    border-radius: 10px;
    width: 80%;
    margin-top: 30px;
  }

  form {
    height: 260px;
  }

  #drop-area.highlight {
    border-color: black;
  }

  #fileElem {
    position: fixed;
    top: -100em;
  }

  @media only screen and (max-width: 800px) {
    #drop-area {
      width: 100%;
      max-width: 100%;
      margin: 0;
      margin-top: 50px;
    }
  }

</style>

{#if style === 'box'}
  <div
    id="drop-area"
    on:click={open}
    on:dragenter={start}
    on:dragover={start}
    on:dragleave={stop}
    on:focus={start}
    on:mouseover={start}
    on:blur={stop}
    on:mouseout={stop}
    on:drop={drop}
    class:highlight class="w-full m-0">
    <form class="text-center w-full">
      <div class="flex justify-center flex-col align-center h-full">
        <span class="text-gray-400 mb-8">{title}</span>
        <button class="primary-btn mx-auto w-36">Choose file</button>
      </div>
      <input
        bind:this={fileInput}
        type="file"
        id="fileElem"
        multiple
        accept="image/*,video/*"
        on:change={(e) => dispatch('file', e.target.files[0])} />
    </form>
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
