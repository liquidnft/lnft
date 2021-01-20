<script>
  import { v4 } from "uuid";
  import { electrs } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { psbt, password, prompt, user, snack, token } from "$lib/store";
  import { Dropzone, SignaturePrompt } from "$comp";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { goto } from "$lib/utils";
  import { requirePassword } from "$lib/utils";
  import { createIssuance, broadcast } from "$lib/wallet";
  import reverse from "buffer-reverse";

  let preview;
  let filename;
  let type;
  let video;
  let hidden;

  $: hidden = type && !type.includes("video");

  let previewFile = (file) => {
    artwork.filename = file.name;
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

  let submit = async (e) => {
    e.preventDefault();
    await requirePassword();
    try {
      $psbt = await createIssuance(artwork.editions, 1000);
    } catch(e) {
      $snack = e.message;
      return;
    } 

    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value === "success" && resolve())
    );
    await tick();
    await broadcast($psbt);

    let tx = $psbt.extractTransaction();
    artwork.asset = reverse(tx.outs[3].asset.slice(1)).toString("hex");
    artwork.id = v4();
    let tags = artwork.tags.map(({ tag }) => ({ tag, artwork_id: artwork.id }));
    let artworkSansTags = { ...artwork };
    delete artworkSansTags.tags;

    createArtwork({
      artwork: artworkSansTags,
      id: artwork.id,
      hash: tx.getId(),
      psbt: $psbt.toBase64(),
      tags,
    }).then(() => goto(`/artwork/${artwork.id}`));
  };
</script>

<style>
  button {
    @apply block bg-green-400 hover:bg-green-600 text-white uppercase text-lg mx-auto p-4 rounded flex-1;
  }
</style>

<div>
  <h1 class="text-2xl font-black text-gray-900 pb-6">Submit Artwork</h1>
</div>

  {#if preview}
    <div class="flex flex-wrap">
      <Form bind:artwork on:submit={submit} />
      <div class="ml-2 flex-1 flex">
        <div class="mx-auto w-1/2">
          {#if type.includes('image')}<img src={preview} class="w-full" />{/if}
          <video controls class:hidden muted autoplay loop class="w-full">
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
