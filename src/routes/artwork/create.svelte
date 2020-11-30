<script>
  import { v4 } from "uuid";
  import { liquid } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { token } from "$lib/store";
  import Dropzone from "$components/Dropzone";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import goto from "$lib/goto";

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

  $: artwork = {
    title: "",
    description: "",
    filename,
    tags: {},
  };

  const createArtwork = mutation(create);
  let issue = async (e) => {
    e.preventDefault();
    let { txid, asset } = await liquid
      .url("/asset")
      .get()
      .json();
    artwork.asset = asset;
    artwork.id = v4();
    createArtwork({ artwork, hash: txid, id: artwork.id }).then(() => {
      goto("/market");
    });
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
    <Form {artwork} on:submit={issue} />
    <div class="ml-2 text-center flex-1 flex">
      <div class="mx-auto">
        {#if type.includes('image')}<img src={preview} />{/if}
          <video controls class:hidden muted autoplay loop>
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
