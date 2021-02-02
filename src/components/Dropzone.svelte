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
    <div class="flex justify-center flex-col align-center h-full">
      <span>UPLOAD YOUR ARTWORK</span>
      <i class="fas fa-cloud-upload-alt mx-auto text-center mt-4 text-5xl secondary-color"></i>
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

<style>
  #fileElem {
    position: fixed;
    top: -100em;
  }

  #drop-area {
    cursor: pointer;
    border: 2px solid #3ba5ac;
    border-radius: 10px;
    width: 70%;
    height:70%;
    max-width: 320px;
    max-height: 320px;
    font-family: sans-serif;
    margin: 100px auto;
  }

  form{
    height: 320px;
  }

  #drop-area.highlight {
    border-color: teal;
  }

  #fileElem {
    position: fixed;
    top: -100em;
  }
</style>
