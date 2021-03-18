<script>
  import { page } from "$app/stores";
  import { v4 } from "uuid";
  import { hasura } from "$lib/api";
  import { tick, onMount } from "svelte";
  import {
    edition,
    fee,
    psbt,
    password,
    prompt,
    user,
    token,
  } from "$lib/store";
  import { Dropzone, ProgressLinear } from "$comp";
  import upload from "$lib/upload";
  import { create } from "$queries/artworks";
  import { mutation } from "@urql/svelte";
  import { btc, kebab, goto, err } from "$lib/utils";
  import { requireLogin, requirePassword } from "$lib/auth";
  import {
    createIssuance,
    signAndBroadcast,
    parseAsset,
    keypair,
  } from "$lib/wallet";
  import reverse from "buffer-reverse";

  import Form from "./_form";
  import Issuing from "./_issuing";

  $: requireLogin($page);

  let preview;
  let filename;
  let type;
  let video;
  let hidden;
  let loading;
  let focus;
  let title;

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
  let progress = async (event) => {
    percent = Math.round((event.loaded / event.total) * 100);

    if (percent >= 100) {
      await tick();
      focus(true);
    }
  };

  $: width = `width: ${percent}%`;

  let url;
  const uploadFile = async ({ detail: file }) => {
    if (!file) return;
    ({ type } = file);

    if (file.size < 100000000) previewFile(file);

    artwork.filename = await upload(file, progress);
    url = preview || `/api/ipfs/${artwork.filename}`;
    await tick();
    if (type.includes("video")) {
      let source = document.createElement("source");
      source.setAttribute("src", url);
      video.appendChild(source);
      video.load();
      video.play();
    }
  };

  let artwork = {
    title: "",
    description: "",
    filename: "",
    asset: "",
    edition: 1,
    editions: 1,
    tags: [],
  };

  const createArtwork = mutation(create);

  let hash, tx;
  const issue = async (ticker) => {
    let contract;
    let domain = `${$user.username}.${window.location.hostname}`;

    let error, success;

    for (let i = 0; i < 5; i++) {
      await requirePassword();

      contract = await createIssuance(artwork, domain, tx);

      try {
        success = await signAndBroadcast();
        break;
      } catch (e) {
        error = e.message;
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    if (!success) {
      console.log($psbt.toBase64());
      throw new Error("Issuance failed: " + error);
    }

    tx = success.extractTransaction();
    artwork.asset = parseAsset(
      tx.outs.find((o) => parseAsset(o.asset) !== btc).asset
    );
    hash = tx.getId();

    return JSON.stringify(contract);
  };

  let tries;
  let l;

  $: generateTicker(title);
  let generateTicker = (t) => {
    if (!t) return;
    artwork.ticker = (t.split(" ").length > 2
      ? t
          .split(" ")
          .map((w) => w[0])
          .join("")
      : t
    )
      .substr(0, 3)
      .toUpperCase();

    l = artwork.ticker.length;
    checks = 0;
    checkTicker();
  };

  let checks;
  let checkTicker = async () => {
    let { data } = await hasura
      .auth(`Bearer ${$token}`)
      .post({
        query: `query { artworks(where: { ticker: { _like: "${artwork.ticker}%" }}) { ticker }}`,
      })
      .json();

    if (!data.errors && data.artworks.length) {
      let { ticker } = data.artworks
        .sort(({ ticker: a }, { ticker: b }) =>
          b.length < a.length
            ? 1
            : a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1)
        )
        .pop();

      artwork.ticker = ticker.replace(
        /.$/,
        String.fromCharCode(ticker.charCodeAt(ticker.length - 1) + 1)
      );
    }
  };

  const alphanumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let submit = async (e) => {
    e.preventDefault();

    if (!type) return err("Unrecognized file type");

    loading = true;
    if (artwork.editions > 1) $prompt = Issuing;

    try {
      await requireLogin();
      artwork.filetype = type;

      for ($edition = 1; $edition <= artwork.editions; $edition++) {
        if ($edition > 1) artwork.ticker += alphanumeric[$edition];

        let contract = await issue();
        tries = 0;
        artwork.id = v4();
        artwork.edition = $edition;
        artwork.slug = kebab(artwork.title || "untitled");

        if ($edition > 1) artwork.slug += "-" + $edition;
        artwork.slug += "-" + artwork.id.substr(0, 5);

        let tags = artwork.tags.map(({ tag }) => ({
          tag,
          artwork_id: artwork.id,
        }));

        let artworkSansTags = { ...artwork };
        delete artworkSansTags.tags;

        let result = await createArtwork({
          artwork: artworkSansTags,
          transaction: {
            artwork_id: artwork.id,
            type: "creation",
            hash,
            contract,
            asset: artwork.asset,
            amount: 1,
            psbt: $psbt.toBase64(),
          },
          tags,
        });

        if (result.error) throw new Error(result.error.message);
      }

      $prompt = undefined;
      goto(`/${artwork.slug}`);
    } catch (e) {
      err(e);
      loading = false;
    }
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

  @media only screen and (max-width: 1023px) {
    .submitArtwork {
      box-shadow: none;
    }

    .container {
      background: none;
    }
  }
</style>

<div class="container mx-auto py-20">
  <div
    class="w-full mx-auto max-w-5xl bg-white md:p-14 rounded-xl submitArtwork boxShadow">
    <a class="block mb-6 text-midblue" href="/">
      <i class="fas fa-chevron-left mr-3" />Back
    </a>
    <h2>Submit artwork</h2>
    <div class="flex flex-wrap flex-col-reverse lg:flex-row">
      <div class="w-full lg:w-1/2 lg:pr-10">
        {#if loading}
          <ProgressLinear />
        {:else}
          <Form bind:artwork bind:focus on:submit={submit} bind:title />
        {/if}
      </div>
      {#if percent}
        <div class="ml-2 flex-1 flex">
          <div class="mx-auto">
            {#if type.includes('image')}
              <img alt="preview" src={url} class="w-full" />
            {/if}
            <video
              controls
              class:hidden
              muted
              autoplay
              loop
              class="w-full"
              bind:this={video}>
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
        <Dropzone on:file={uploadFile} style="box" />
      {/if}
    </div>
  </div>
</div>
