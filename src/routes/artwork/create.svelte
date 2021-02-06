<script>
  import { page } from "$app/stores";
  import { v4 } from "uuid";
  import { electrs } from "$lib/api";
  import { tick, onMount } from "svelte";
  import { psbt, password, prompt, user, token } from "$lib/store";
  import { Dropzone, SignaturePrompt } from "$comp";
  import upload from "$lib/upload";
  import Form from "./_form";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { goto, sanitize, err } from "$lib/utils";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { createIssuance, broadcast, parseAsset } from "$lib/wallet";
  import reverse from "buffer-reverse";

  $: requireLogin($page);

  let preview;
  let filename;
  let type;
  let video;
  let hidden;

  $: hidden = type && !type.includes("video");

  let previewFile = (file) => {
    console.log(file);
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (type.includes("video")) {
        preview = URL.createObjectURL(file);
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

  let url;
  const uploadFile = ({ detail: file }) => {
    if (!file) return;
    artwork.filename = sanitize(file.name);
    ({ type } = file);
    if (file.size < 100000000) previewFile(file);
    url = preview || `/api/storage/o/public/${file.name}`;

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

  let hash;
  const issue = async () => {
    await requirePassword();

    try {
      $psbt = await createIssuance(artwork.editions, 1000);
    } catch (e) {
      err(e);
      return;
    }

    $prompt = SignaturePrompt;
    await new Promise((resolve) =>
      prompt.subscribe((value) => value === "success" && resolve())
    );
    await tick();
    await broadcast($psbt);
    let tx = $psbt.extractTransaction();
    artwork.asset = parseAsset(tx.outs[3].asset);

    hash = tx.getId();
  };

  let submit = async (e) => {
    e.preventDefault();
    await requireLogin();

    await issue();

    artwork.id = v4();
    let tags = artwork.tags.map(({ tag }) => ({ tag, artwork_id: artwork.id }));
    let artworkSansTags = { ...artwork };
    delete artworkSansTags.tags;

    createArtwork({
      artwork: artworkSansTags,
      id: artwork.id,
      hash,
      tags,
    }).then(() => goto(`/artwork/${artwork.id}`));
  };
</script>

<style>
  button {
    @apply block bg-green-400 hover:bg-green-600 text-white uppercase text-lg mx-auto p-4 rounded flex-1;
  }
</style>

<div class="container mx-auto mt-20">
  <div class="flex flex-1">
    <h1 class="title primary-color">Submit Artwork</h1>
  </div>

  {#if percent}
    <div class="flex flex-wrap">
      <div class="w-1/2 max-w-sm">
        <Form bind:artwork on:submit={submit} />
      </div>
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
    </div>
  {:else}
    <Dropzone on:file={uploadFile} />
  {/if}
</div>
