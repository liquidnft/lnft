<script>
  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  let fileInput;
  let highlight;

  let drop = (e) => {
    stop(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    dispatch('file', dt.files[0]);
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
    Upload your artwork by dragging an image file here
    <input
      bind:this={fileInput}
      type="file"
      id="fileElem"
      multiple
      accept="image/*"
      on:change={(e) => dispatch('file', e.target.files[0])} />
  </form>
</div>

<style>
  #fileElem {
    position: fixed;
    top: -100em;
  }

  #drop-area {
    min-height: 200px;
    cursor: pointer;
    border: 2px dashed #ccc;
    border-radius: 20px;
    width: 480px;
    font-family: sans-serif;
    margin: 100px auto;
    padding: 20px;
  }

  #drop-area.highlight {
    border-color: teal;
  }

  #fileElem {
    position: fixed;
    top: -100em;
  }
</style>
