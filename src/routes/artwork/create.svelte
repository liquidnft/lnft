<script>
  import { page } from "$app/stores";
  import { v4 } from "uuid";
  import { electrs } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { psbt, password, prompt, user, token } from "$lib/store";
  import { Dropzone, ProgressLinear } from "$comp";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { goto, err } from "$lib/utils";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { createIssuance, signAndBroadcast, parseAsset } from "$lib/wallet";
  import reverse from "buffer-reverse";

  $: requireLogin($page);

  let preview;
  let filename;
  let type;
  let video;
  let hidden;
  let loading;

  $: hidden = type && !type.includes("video");

  let previewFile = (file) => {
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (type.includes("video")) preview = URL.createObjectURL(file);
    };

    reader.readAsDataURL(file);
  };

  let percent;
  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  $: width = `width: ${percent}%`;

  let url;
  const uploadFile = async ({ detail: file }) => {
    if (!file) return;
    ({ type } = file);

    if (file.size < 100000000) previewFile(file);

    artwork.filename = await upload(file, progress);
    url = preview || `/api/ipfs/${artwork.filename}`;
    if (!preview && type.includes("video"))
      setTimeout(video.parentElement.load, 500);
  };

  let artwork = {
    title: "",
    description: "",
    filename: "",
    asset: "",
    editions: 1,
    tags: [],
  };

  const createArtwork = mutation(create);

  let hash;
  const issue = async () => {
    await requirePassword();

    $psbt = await createIssuance(artwork.editions, 1000);

    await signAndBroadcast();
    let tx = $psbt.extractTransaction();
    artwork.asset = parseAsset(tx.outs[3].asset);

    hash = tx.getId();
  };

  let submit = async (e) => {
    loading = true;
   

    try {
      e.preventDefault();
      await requireLogin();

      await issue();

      artwork.id = v4();
      artwork.filetype = type;

      let tags = artwork.tags.map(({ tag }) => ({
        tag,
        artwork_id: artwork.id,
      }));
      let artworkSansTags = { ...artwork };
      delete artworkSansTags.tags;
      await createArtwork({
        artwork: artworkSansTags,
        id: artwork.id,
        hash,
        tags,
      });

      goto(`/artwork/${artwork.id}`);
    } catch (e) {
      err(e);
    }

    loading = false;
  };

</script>

<style>

  .container {
    background-color: #ecf6f7;
    width: 100% !important;
    min-height: 100vh;
    margin: 0;
    max-width: 100%;
  }

  button {
    @apply block bg-green-400 hover:bg-green-600 text-white uppercase text-lg mx-auto p-4 rounded flex-1;
  }

  @media only screen and (max-width: 1023px){
    .submitArtwork{
      box-shadow: none;
    }

    .container{
      background: none;
    }
  }
</style>

<div class="container mx-auto py-20">
    <div class="w-full mx-auto max-w-5xl bg-white md:p-14 rounded-xl submitArtwork boxShadow">
      <a class="block mb-6 text-midblue" href="/">
        <i class="fas fa-chevron-left mr-3"/>Back
      </a>
      <h2>Submit artwork</h2>
      <div class="flex flex-wrap flex-col-reverse lg:flex-row">
        <div class="w-full lg:w-1/2 lg:pr-10">
          {#if loading}
            <ProgressLinear />
          {:else}
            <Form bind:artwork on:submit={submit} />
          {/if}
        </div>
        {#if percent }
        <div class="ml-2 flex-1 flex">
          <div class="mx-auto">
            {#if type.includes('image')}
              <img alt="preview" src={url} class="w-full" />
            {/if}
            <video controls class:hidden muted autoplay loop class="w-full">
              <source src={url} bind:this={video} />
              Your browser does not support HTML5 video.
            </video>
            <div class="w-full bg-grey-light p-8">
              <div
                class="bg-green-200 font-bold rounded-full p-4 mx-auto max-w-xs text-center"
                style={width}>
                {#if percent < 100}{percent}%{:else}Upload Complete!{/if}
              </div>
            </div>
          </div>
        </div>
        {:else}
        <Dropzone on:file={uploadFile} />
        {/if}
      </div>
    </div>
</div>
