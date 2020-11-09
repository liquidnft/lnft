<script>
  import { onMount } from "svelte";
  import { token } from "$components/store";
  import decode from "jwt-decode";

  let preview;
  let fileInput;
  let highlight;

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

  let previewFile = (file) => {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  let uploadFile = (file) => {
    let id = decode($token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
    previewFile(file);
    let url = `/api/storage/o/user/${id}/${file.name}`;
    let formData = new FormData();

    formData.append("file", file);

    fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${$token}`,
      },
    })
  };

  let handleFiles = ({ target: { files } }) => {
    [...files].forEach(uploadFile);
  };

  let drop = (e) => {
    stop(e);
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
      on:change={handleFiles} />
  </form>
</div>

{#if preview}<img src={preview} class="mx-auto" />{/if}
