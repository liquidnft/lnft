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
  import { page, session } from "$app/stores";
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { v4 } from "uuid";
  import { query, api } from "$lib/api";
  import { tick, onDestroy } from "svelte";
  import {
    edition,
    fee,
    psbt,
    password,
    titles,
    token,
    txcache,
    user,
  } from "$lib/store";
  import { Dropzone, ProgressLinear } from "$comp";
  import { upload, supportedTypes } from "$lib/upload";
  import { btc, kebab, goto, err, info, sleep } from "$lib/utils";
  import { requirePassword } from "$lib/auth";
  import {
    DUST,
    createIssuance,
    sign,
    parseAsset,
    parseVal,
    keypair,
    getInputs,
    network,
  } from "$lib/wallet";
  import reverse from "buffer-reverse";
  import { ArtworkMedia } from "$comp";
  import branding from "$lib/branding";
  import { address } from "liquidjs-lib";

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

  let hash, tx, inputs, total, transactions;
  let required = 0;
  const issue = async () => {
    let contract;
    let domain = branding.urls.base;
    let error, success;

    contract = await createIssuance(artwork, domain, inputs.pop());

    $titles = [...$titles, artwork];

    await sign(1, false);
    await tick();

    tx = $psbt.extractTransaction();
    required += parseVal(tx.outs.find((o) => o.script.length === 0).value);

    $txcache[tx.getId()] = tx;

    if (
      tx.outs.find(
        (o) =>
          parseAsset(o.asset) === btc &&
          o.script.toString("hex") ===
            address.toOutputScript($user.address, network).toString("hex") &&
          parseVal(o.value) > DUST
      )
    ) {
      inputs.unshift(tx);
    }
    transactions.push({ contract, psbt: $psbt.toBase64() });
  };

  let tries;
  let l;

  let submit = async (e) => {
    e.preventDefault();
    await requirePassword();
    transactions = [];
    if (!artwork.title) return err("Please enter a title");

    if (!artwork.filename)
      return err("File not uploaded or hasn't finished processing");
    if (!type) return err("Unrecognized file type");

    loading = true;

    try {
      [inputs, total] = await getInputs();

      for ($edition = 1; $edition <= artwork.editions; $edition++) {
        await issue();
        await sleep(10);
        await info(
          `Signed issuance transaction ${$edition} of ${artwork.editions}`
        );
        tries = 0;
      }

      if (total < required)
        throw { message: "Insufficient funds", required, btc, total };

      let { issuance, slug } = await api
        .url("/issue")
        .auth(`Bearer ${$token}`)
        .post({
          artwork,
          transactions,
        })
        .json();

      goto(`/a/${slug}`);
    } catch (e) {
      console.log(e);
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
