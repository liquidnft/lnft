<script>
  import Core from '$lib/lnft-core';
  import FormItem from './components/_form-item.svelte';
  import {ProgressLinear} from "$comp";
  import {page} from "$app/stores";
  import {query} from "$lib/api";
  import {onMount, tick} from "svelte";
  import Form from "./_form.svelte";
  import {
    prompt,
  } from "$lib/store";
  import {Dropzone, ArtworkMedia} from "$comp";
  import upload from "$lib/upload";
  import {goto, err} from "$lib/utils";
  import {requireLogin, requirePassword} from "$lib/auth";
  import Issuing from "./_issuing.svelte";

  $: requireLogin($page);

  let preview;
  let filename;
  let type;
  let tags;
  let video;
  let hidden = true;
  let loading;
  let focus;

  const IMG_TYPES = {
    MAIN: 0,
    COVER: 1,
  };

  const imagePreview = [null, null];
  const imagePercent = [0, 0];

  let previewFile = (imageType, file) => {
    var reader = new FileReader();

    reader.onload = async (e) => {
      imagePercent[imageType] = 1;
      imagePreview[imageType] = e.target.result;
      await tick();
      if (type.includes("video")) {
        imagePreview[imageType] = URL.createObjectURL(file);
      } else {
        url = preview;
      }
    };

    reader.readAsDataURL(file);
  };

  let percent;
  let progress = (imageType) => {
    return async (event) => {
      imagePercent[imageType] = Math.round((event.loaded / event.total) * 100);

      if (imagePercent[imageType] >= 100) {
        await tick();
        focus(true);
      }
    };
  }

  let url;
  const uploadFile = (imageType) => {
    return async ({detail: file}) => {
      if (!file) return;
      ({type} = file);

      if(imageType === IMG_TYPES.MAIN) {
        artwork.filetype = type;
      }

      if (file.size < 100000000) previewFile(imageType, file);

      try {
        if(imageType === IMG_TYPES.MAIN) {
          artwork.filename = await upload(file, progress(imageType));
        } else if (imageType === IMG_TYPES.COVER) {
          artwork.cover_filename = await upload(file, progress(imageType));
        }
      } catch (e) {
        err(e);
        imagePercent[imageType] = 0;
        return;
      }

      url = `/api/ipfs/${artwork.filename}`;
      await tick();
    };
  }

  let artwork = {
    title          : "",
    description    : "",
    filename       : "",
    filetype       : "",
    ticker         : "",
    package_content: "",
    asset          : "",
    edition        : 1,
    editions       : 1,
    tags           : [],
  };

  async function submit(e) {
    e.preventDefault();

    await requirePassword();

    if (!artwork.title)
      return err('Title is required');

    if (!artwork.description)
      return err('Description is required');

    if (!artwork.description)
      return err('Description is required');

    if (!artwork.editions || isNaN(Number(artwork.editions)))
      return err('Editions is required and should be a number');

    const core = new Core();

    try {
      if (artwork.editions > 1) {
        $prompt = Issuing;
      }
      loading = true;
      artwork = await core.createArtwork({
        artwork,
        // for Cozmos client we should generate tickers automatically,
        // and check their availability
        generateRandomTickers: true,
      });
      $prompt = undefined;
      goto(`/a/${artwork.slug}`);
    } catch (e) {
      err(e);
      loading = false;
      $prompt = undefined;
    }
  }

  $: console.log(imagePercent);

  function cancelPreview(imageType) {
    return () => {
      console.log(`debug canceled event received`);
      imagePreview[imageType] = null;
      imagePercent[imageType] = 0;
    }
  }

</script>

<style>
  .container {
    width: 100% !important;
    min-height: 100vh;
    margin: 0;
    max-width: 100%;
  }

  .upload-button {
    width: 100%;
    height: 320px;
  }

  .submitArtwork {
    box-shadow: 6px 5px 12px 2px #ccc;
  }

  @media only screen and (max-width: 1023px) {
    .upload-button {
      margin-top: 25px;
    }

    .container {
      background: none;
    }
  }

  h2 {
    font-family: "Zen Dots", cursive;
    font-size: 2em;
    line-height: 1.25em;
  }

  h3 {
    font-size: 1em;
  }

</style>

<div class="container mx-auto p-20">
  <div class="absolute border-black border-l border-t w-12 h-12 -ml-5 -mt-5">
    &nbsp;
  </div>
  <!--
  <div
    class="absolute right-0 bottom-0 border-black border-r border-b w-12 h-12 mr-12">
    &nbsp;
  </div>
  -->
  <div class="flex w-full mx-auto bg-gray-100 submitArtwork">
    <div
      class="absolute right-16 rounded-full border-black border-l border-t w-8 h-8 -mt-4 z-50 bg-black text-4xl text-center text-white cursor-pointer">
      <div class="-mt-2">&times;</div>
    </div>
    <div class="flex flex-col w-1/3">
      <div class="flex-grow-1 h-full bg-black">
        <h2 class="text-white p-14">Preview experience</h2>
        <div style="background-image: url('/stars.png')" class="h-full bg-left mt-auto bg-repeat w-full"></div>
      </div>
    </div>
    <div class="p-14">
      <div class="w-3/5 mx-auto text-center mb-12">
        <h2>Create Experience</h2>
        <p>
          Here at Cozmos we value the experience more than the "Art" itself, in
          the sense that we will always put the experience given to the buyer
          1st.
        </p>
        <p />
        <p>
          <b>Please make sure you are giving an Added value to the "Art"</b>
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 text-left">
        <div>
          <FormItem title="Upload thumbnail (your NFT)">
            {#if imagePreview[IMG_TYPES.MAIN] || imagePercent[IMG_TYPES.MAIN]}
              <div class="text-black">
                <div class="mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center relative p-4">
                  {#if imagePercent[IMG_TYPES.MAIN] && imagePercent[IMG_TYPES.MAIN] < 100}
                    Loading...
                  {:else if (imagePercent[IMG_TYPES.MAIN] && imagePercent[IMG_TYPES.MAIN] === 100)}
                    <ArtworkMedia {artwork} preview={imagePreview[IMG_TYPES.MAIN]} on:cancel={cancelPreview(IMG_TYPES.MAIN)}/>
                  {/if}
                </div>
              </div>
            {:else}
              <Dropzone on:file={uploadFile(IMG_TYPES.MAIN)}/>
            {/if}
          </FormItem>
        </div>
        <div>
          <FormItem title="Upload cover">
            {#if imagePreview[IMG_TYPES.COVER] || imagePercent[IMG_TYPES.COVER]}
              <div class="text-black">
                <div class="mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center relative p-4">
                  {#if imagePercent[IMG_TYPES.COVER] && imagePercent[IMG_TYPES.COVER] < 100}
                    Loading...
                  {:else if (imagePercent[IMG_TYPES.COVER] && imagePercent[IMG_TYPES.COVER] === 100)}
                    <ArtworkMedia {artwork} preview={imagePreview[IMG_TYPES.COVER]} on:cancel={cancelPreview(IMG_TYPES.COVER)}/>
                  {/if}
                </div>
              </div>
            {:else}
              <Dropzone on:file={uploadFile(IMG_TYPES.COVER)}/>
            {/if}
          </FormItem>
        </div>
<!--        <div>-->
<!--          <FormItem title="Upload content">-->
<!--            <Dropzone on:file={uploadFile}/>-->
<!--          </FormItem>-->
<!--        </div>-->
<!--        <div>-->
<!--          <FormItem title="Upload Video Experience Information">-->
<!--            <Dropzone on:file={uploadFile}/>-->
<!--          </FormItem>-->
<!--        </div>-->
      </div>
      <div class="flex flex-wrap flex-col-reverse lg:flex-row">
        <div class="w-full">
          <div class:invisible={!loading}>
            <ProgressLinear />
          </div>
          <div class:invisible={loading}>
            <Form bind:artwork bind:focus on:submit={submit} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
