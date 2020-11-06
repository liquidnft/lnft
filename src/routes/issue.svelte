<script>
  import { onMount } from "svelte";

  let preview;
  let fileInput;
  let highlight;

  let start = e => highlight = true;
  let stop = e => highlight = false;

  let open = (e) => {
    fileInput.click();
  };

  let previewFile = file => {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  let uploadFile = (file) => {
    previewFile(file);
console.log(file);
    let url = "/";
    let formData = new FormData();

    formData.append("image", file);


    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        console.log("done");
      })
      .catch(() => {
        console.log("bad");
      });
  };

  let handleFiles = ({ target: { files } }) => {
    [...files].forEach(uploadFile);
  };

  let drop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles({ target: { files } });
  };
</script>

<style>
  img {
    max-width: 300px;
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

  .button {
    display: inline-block;
    padding: 10px;
    background: #ccc;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .button:hover {
    background: #ddd;
  }
  #fileElem {
    position: fixed;
    top: -100em;
  }
</style>

<div
  id="drop-area"
  on:click={open}
  on:dragover={start}
  on:dragout={stop}
  on:mouseover={start}
  on:mouseout={stop}
  on:drop={drop}
  class:highlight
  >
  <form class="text-center">
    Upload your artwork by dragging an image file here
    <input
      bind:this={fileInput}
      type="file"
      id="fileElem"
      multiple
      accept="image/*"
      on:change={handleFiles} />
  </form>
</div>

{#if preview}<img src={preview} class="mx-auto" />{/if}
