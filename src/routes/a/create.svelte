<script context="module">
  export async function load({ session }) {
    if (!(session && session.user))
      return {
        status: 302,
        redirect: "/login",
      };

    return {};
  }
</script>

<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/stores";
  import { v4 } from "uuid";
  import { hasura, api } from "$lib/api";
  import { tick, onDestroy } from "svelte";
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
  import { upload, supportedTypes } from "$lib/upload";
  import { create } from "$queries/artworks";
  import { btc, kebab, goto, err } from "$lib/utils";
  import { requireLogin, requirePassword } from "$lib/auth";
  import {
    createIssuance,
    sign,
    broadcast,
    parseAsset,
    keypair,
  } from "$lib/wallet";
  import reverse from "buffer-reverse";
  import { ArtworkMedia } from "$comp";
  import branding from "$lib/branding";

  import Form from "./_form.svelte";
  import Issuing from "./_issuing.svelte";

  let preview;
  let filename;
  let type;
  let video;
  let hidden = true;
  let loading;
  let focus;
  let title;

  let previewFile = (file) => {
    var reader = new FileReader();

    reader.onload = async (e) => {
      percent = 1;
      preview = e.target.result;
      await tick();
      if (type.includes("video")) {
        preview = URL.createObjectURL(file);
      } else {
        url = preview;
      }
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
    artwork.filetype = type;

    if (supportedTypes.includes(type))
      throw new Error("Supported file types are jpg, png, gif, mp4");

    if (file.size < 100000000) previewFile(file);

    try {
      artwork.filename = await upload(file, progress);
    } catch (e) {
      err(e);
      percent = 0;
      return;
    }

    url = `/api/ipfs/${artwork.filename}`;
    await tick();
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

  let hash, tx;
  const issue = async (ticker) => {
    let contract;
    let domain =
      $user.username === branding.superUserName
        ? branding.urls.base
        : `${$user.username.toLowerCase()}.${branding.urls.base}`;

    let error, success;

    await requirePassword();

    contract = await createIssuance(artwork, domain, tx);

    await sign();
    await broadcast(true);
    await tick();

    tx = $psbt.extractTransaction();
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
    artwork.ticker = (
      t.split(" ").length > 2
        ? t
            .split(" ")
            .map((w) => w[0])
            .join("")
        : t
    )
      .substr(0, 3)
      .toUpperCase();

    checkTicker();
  };

  let checkTicker = async () => {
    let { data } = await hasura
      .auth(`Bearer ${$token}`)
      .post({
        query: `query { artworks(where: { ticker: { _like: "${artwork.ticker.toUpperCase()}%" }}) { ticker }}`,
      })
      .json();

    if (!data.errors && data.artworks && data.artworks.length) {
      let tickers = data.artworks.sort(({ ticker: a }, { ticker: b }) =>
        b.length < a.length
          ? 1
          : b.length > a.length
          ? -1
          : a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1)
      );

      if (tickers.map((a) => a.ticker).includes(artwork.ticker)) {
        let { ticker } = tickers.pop();
        artwork.ticker =
          ticker.substr(0, 3) + c[c.indexOf(ticker.substr(3)) + 1];
      }
    }
  };

  let checkTickers = async (tickers) => {
    let { data } = await hasura
      .auth(`Bearer ${$token}`)
      .post({
        query: `query { artworks(where: { ticker: { _in: ${JSON.stringify(
          tickers
        )} }}) { ticker }}`,
      })
      .json();

    if (data.artworks && data.artworks.length)
      throw new Error(
        `Ticker(s) not available: ${data.artworks
          .map((a) => a.ticker)
          .join(", ")}`
      );
  };

  let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let b = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      b.push(a[i] + a[j]);
    }
  }
  let c = [...a, ...b];

  let submit = async (e) => {
    e.preventDefault();
    if (!artwork.title) return err("Please enter a title");
    if (!artwork.ticker) return err("Please enter a ticker symbol");

    if (!artwork.filename)
      return err("File not uploaded or hasn't finished processing");
    if (!type) return err("Unrecognized file type");

    loading = true;

    try {
      await requireLogin();

      let { ticker } = artwork;
      let tickers = [];

      for ($edition = 1; $edition <= artwork.editions; $edition++) {
        if ($edition > 1)
          ticker =
            artwork.ticker.substr(0, 3) + c[c.indexOf(ticker.substr(3)) + 1];
        tickers.push(ticker.toUpperCase());
      }

      await checkTickers(tickers);

      if (artwork.editions > 1) $prompt = Issuing;

      for ($edition = 1; $edition <= artwork.editions; $edition++) {
        if ($edition > 1) {
          artwork.ticker = tickers[$edition - 1];
          await new Promise((r) => setTimeout(r, 5000));
        }
        artwork.ticker = artwork.ticker.toUpperCase();

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

        let variables = {
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
        };

        let result = await hasura
          .auth(`Bearer ${$token}`)
          .post({
            query: create,
            variables,
          })
          .json();

        if (result.error) throw new Error(result.error.message);

        await api.url("/mail-artwork-minted").auth(`Bearer ${$token}`).post({
          userId: $user.id,
          artworkId: artwork.id,
        });
      }

      $prompt = undefined;
      goto(`/a/${artwork.slug}`);
    } catch (e) {
      err(e);
      loading = false;
    }
  };
</script>

<div class="container mx-auto py-20">
  <div
    class="w-full mx-auto max-w-5xl bg-white md:p-14 rounded-xl submitArtwork boxShadow"
  >
    <a
      class="block mb-6 text-midblue"
      href="."
      on:click|preventDefault={() => window.history.back()}
    >
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back</div>
      </div>
    </a>
    <h2>Submit artwork</h2>
    <div class="flex flex-wrap flex-col-reverse lg:flex-row">
      <div class="w-full lg:w-1/2 lg:pr-10">
        <div class:invisible={!loading}>
          <ProgressLinear />
        </div>
        <div class:invisible={loading}>
          <Form bind:artwork bind:focus on:submit={submit} bind:title />
        </div>
      </div>
      {#if percent}
        <div class="ml-2 flex-1 flex">
          <div class="upload-button mx-auto">
            <ArtworkMedia
              {artwork}
              {preview}
              showDetails={false}
              thumb={false}
            />
            <div class="w-full bg-grey-light p-8">
              <div
                class="font-light p-4 mx-auto max-w-xs text-center"
                class:bg-primary={percent >= 100 && artwork.filename}
                class:bg-yellow-200={percent < 100 || !artwork.filename}
                style={width}
              >
                {#if percent < 100}
                  {percent}%
                {:else if artwork.filename}
                  Upload complete!
                {:else}Processing...{/if}
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

<style>
  .container {
    background-color: #ecf6f7;
    width: 100% !important;
    min-height: 100vh;
    margin: 0;
    max-width: 100%;
  }

  .upload-button {
    width: 100%;
    height: 320px;
  }

  @media only screen and (max-width: 1023px) {
    .upload-button {
      margin-top: 25px;
    }

    .submitArtwork {
      box-shadow: none;
    }

    .container {
      background: none;
    }
  }
</style>
