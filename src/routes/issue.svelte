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

  let percent;
  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  }

  $: width = `width: ${percent}%`;

  let complete = (event) => {
    console.log(event);
  }

  let uploadFile = (file) => {
    let id = decode($token)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
    previewFile(file);
    let url = `/api/storage/o/user/${id}/${file.name}`;
    let formData = new FormData();

    formData.append("file", file);

    let ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progress, false);
    ajax.addEventListener("load", complete, false);
    ajax.open("POST", url);
    ajax.setRequestHeader("Authorization", `Bearer ${$token}`);
    ajax.send(formData);
  };

  let handleFiles = ({ target: { files } }) => {
  };

  let drop = (e) => {
    stop(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    uploadFile(dt.files[0]);
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

{#if percent}
<div class="shadow w-full bg-grey-light mt-2 mb-2">
    <div class="bg-teal-400 text-xs leading-none py-1 text-center text-white" style={width}>{percent}%</div>
  </div>
{:else}
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
      on:change={e => uploadFile(e.target.files[0])}
 />
  </form>
</div>
{/if}

{#if preview}<img src={preview} class="mx-auto" />{/if}
