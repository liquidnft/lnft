<script>
  import { onMount } from "svelte";
  import { token } from "$lib/store";
  import Dropzone from "$components/Dropzone";
  import Form from "./_form";

  let preview;
  let filename;
  let type;

  let previewFile = (file) => {
    filename = file.name;
    type = file.type;
    var reader = new FileReader();

    reader.onload = function (e) {
      preview = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  let percent;
  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  $: width = `width: ${percent}%`;

  let uploadFile = ({ detail: file }) => {
    previewFile(file);
    let url = `/api/storage/o/public/${file.name}`;
    let formData = new FormData();

    formData.append("file", file);

    let ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progress, false);
    ajax.open("POST", url);
    ajax.setRequestHeader("Authorization", `Bearer ${$token}`);
    ajax.send(formData);
  };
</script>

<style>
  img {
    max-width: 300px;
  }
</style>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6">Submit Artwork</h1>
</div>

{#if preview}
  <div class="flex flex-wrap">
    <Form {filename} />
    <div class="ml-2 text-center flex-1 flex">
      <div class="mx-auto">
        <img src={preview} />
        <div class="shadow w-full bg-grey-light mt-2 mb-2">
          <div
            class="bg-gray-800 text-xs leading-none py-2 text-center text-white"
            style={width}>
            {#if percent < 100}{percent}%{:else}Upload Complete!{/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <Dropzone on:file={uploadFile} />
{/if}
