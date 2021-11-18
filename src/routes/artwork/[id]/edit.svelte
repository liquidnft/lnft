<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Form from "../_form.svelte";
  import { getArtwork } from "$queries/artworks";
  import { updateArtwork, updateTags } from "$queries/artworks";
  import { err, goto } from "$lib/utils";
  import { password, user, token } from "$lib/store";
  import { requireLogin, requirePassword } from "$lib/auth";
  import { query } from "$lib/api";

  let { id } = $page.params;
  let artwork;

  onMount(async () => {
    await requireLogin();
    query(getArtwork(id))
      .then((res) => {
        artwork = res.artworks_by_pk;
      })
      .catch(err);
  });

  let update = async (e) => {
    e.preventDefault();

    let { id: artwork_id, description, filename, title, tags, package_content } = artwork;

    query(updateTags, {
      tags: tags.map(({ tag }) => ({ tag, artwork_id })),
      artwork_id,
    })
      .then(() => {
        query(updateArtwork, {
          artwork: { description, title, package_content },
          id,
        })
          .then(() => {
            goto(`/a/${artwork.slug}`);
          })
          .catch(err);
      })
      .catch(err);
  };

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
    {#if artwork}
      <a href={`/a/${artwork.slug}`}>
        <div
            class="absolute right-16 rounded-full border-black border-l border-t w-8 h-8 -mt-4 z-50 bg-black text-4xl text-center text-white cursor-pointer">
          <div class="-mt-2">&times;</div>
        </div>
      </a>
    {/if}
    <div class="flex flex-col w-1/3">
      <div class="flex-grow-1 h-full bg-black">
        <h2 class="text-white p-14">Preview experience</h2>
        <div style="background-image: url('/stars.png')" class="h-full bg-left mt-auto bg-repeat w-full"></div>
      </div>
    </div>
    <div class="p-14">
      <div class="w-3/5 mx-auto text-center mb-12">
        <h2>Edit Experience</h2>
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

<!--      <div class="grid grid-cols-2 gap-4 text-left">-->
<!--        <div>-->
<!--          <FormItem title="Upload thumbnail (your NFT)">-->
<!--            {#if imagePreview[IMG_TYPES.MAIN] || imagePercent[IMG_TYPES.MAIN]}-->
<!--              <div class="text-black">-->
<!--                <div class="mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center relative p-4">-->
<!--                  {#if imagePercent[IMG_TYPES.MAIN] && imagePercent[IMG_TYPES.MAIN] < 100}-->
<!--                    Loading...-->
<!--                  {:else if (imagePercent[IMG_TYPES.MAIN] && imagePercent[IMG_TYPES.MAIN] === 100)}-->
<!--                    <ArtworkMedia {artwork} preview={imagePreview[IMG_TYPES.MAIN]} on:cancel={cancelPreview(IMG_TYPES.MAIN)}/>-->
<!--                  {/if}-->
<!--                </div>-->
<!--              </div>-->
<!--            {:else}-->
<!--              <Dropzone on:file={uploadFile(IMG_TYPES.MAIN)}/>-->
<!--            {/if}-->
<!--          </FormItem>-->
<!--        </div>-->
<!--        <div>-->
<!--          <FormItem title="Upload cover">-->
<!--            {#if imagePreview[IMG_TYPES.COVER] || imagePercent[IMG_TYPES.COVER]}-->
<!--              <div class="text-black">-->
<!--                <div class="mt-4 h-44 rounded-md border-gray-300 border flex flex-col justify-center items-center relative p-4">-->
<!--                  {#if imagePercent[IMG_TYPES.COVER] && imagePercent[IMG_TYPES.COVER] < 100}-->
<!--                    Loading...-->
<!--                  {:else if (imagePercent[IMG_TYPES.COVER] && imagePercent[IMG_TYPES.COVER] === 100)}-->
<!--                    <ArtworkMedia {artwork} preview={imagePreview[IMG_TYPES.COVER]} on:cancel={cancelPreview(IMG_TYPES.COVER)}/>-->
<!--                  {/if}-->
<!--                </div>-->
<!--              </div>-->
<!--            {:else}-->
<!--              <Dropzone on:file={uploadFile(IMG_TYPES.COVER)}/>-->
<!--            {/if}-->
<!--          </FormItem>-->
<!--        </div>-->
<!--      </div>-->
      <div class="flex flex-wrap flex-col-reverse lg:flex-row">
        <div class="w-full">
<!--          <div class:invisible={!loading}>-->
<!--            <ProgressLinear />-->
<!--          </div>-->
          <div>
            {#if artwork}
              <Form bind:artwork on:submit={update} />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
