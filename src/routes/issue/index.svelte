<script>
  import { tick, onMount } from "svelte";
  import { token } from "$lib/store";
  import Dropzone from "$components/Dropzone";
  import upload from "$lib/upload";
  import Form from "./_form";

  let preview;
  let filename;
  let type;
  let video;
  let hidden;

  $: hidden = type && !type.includes('video');

  let previewFile = (file) => {
    filename = file.name;
    type = file.type;
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (type.includes("video")) {
        video.src = URL.createObjectURL(file);
        video.parentElement.load();
      }
    };

    reader.readAsDataURL(file);
  };

  let percent;
  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  $: width = `width: ${percent}%`;

  const uploadFile = ({ detail: file }) => {
    if (!file) return;
    previewFile(file);
    upload(file, $token, progress);
  }
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
        {#if type.includes('image')}<img src={preview} />{/if}
          <video controls class:hidden muted autoplay>
          <source bind:this={video} />
          Your browser does not support HTML5 video.
        </video>
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
