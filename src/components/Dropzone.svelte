<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title = "Upload Your Artwork";

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
    border: 2px solid #6ED8E0;
    border-radius: 10px;
    width: 80%;
    max-width: 350px;
    max-height: 350px;
    margin: 100px auto;
  }

  form {
    height: 320px;
  }

  #drop-area.highlight {
    border-color: #6ED8E0;
  }

  #fileElem {
    position: fixed;
    top: -100em;
  }

  @media only screen and (max-width: 500px) {
    #drop-area{
      width: 100%;
      max-width:100%;
      margin: 0;
      margin-top: 50px;
    }
  }
</style>

<div
  id="drop-area"
  on:click={open}
  on:dragenter={start}
  on:dragover={start}
  on:dragleave={stop}
  on:mouseover={start}
  on:mouseout={stop}
  on:drop={drop}
  class:highlight>
  <form class="text-center">
    <div class="flex justify-center flex-col align-center h-full">
      <span class="uppercase">{title}</span>
      <i
        class="fas fa-cloud-upload-alt mx-auto text-center mt-4 text-5xl text-lightblue" />
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
