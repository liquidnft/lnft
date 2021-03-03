<script>
  import { onMount, tick } from "svelte";
  import { user, token } from "$lib/store";
  import { info, goto } from "$lib/utils";
  import { Avatar } from "$components/index";
  import { Dropzone, ProgressLinear } from "$comp";
  import upload from "$lib/upload";
  import { updateUser } from "$queries/users";
  import { mutation, subscription } from "@urql/svelte";

  let initialize = (user) => {
    if (!(form && form.id) && user) form = { ...user };
  };

  $: initialize($user);

  let form;
  let fileInput;
  let filename;
  let preview;
  let file;
  let percent;
  let video;
  let type;
  let url;
  let hidden;

  $: width = `width: ${percent}%`;

  const uploadFile = async ({ detail: file }) => {
    if (!file) return;
    ({ type } = file);

    if (file.size < 100000000) previewFile(file);

    let filename = await upload(file, progress);
    url = preview || `/api/ipfs/${filename}`;
    url += '#t=0.5';

    await tick();
    if (type.includes("video")) {
      let source = document.createElement('source');
      source.setAttribute('src', url);
      video.appendChild(source);
      video.load();
      video.play();
    }
  };

  let previewFile = (file) => {
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (type.includes("video")) preview = URL.createObjectURL(file);
    };

    reader.readAsDataURL(file);
  };

  let fileChosen = (e) => {
    file = e.target.files[0];
    if (!file) return;
    filename = file.name;
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  let submit = async () => {
    if (file) {
      form.avatar_url = await upload(file, progress);
    }

    update(form);
  };

  let updateUser$ = mutation(updateUser);

  let update = (form) => {
    let {
      is_artist,
      is_admin,
      num_followers,
      num_follows,
      followed,
      id,
      balance,
      ...user
    } = form;
    updateUser$({ user, id }).then((r) => {
      info("Profile updated");
      goto(`/user/${id}`);
    });
  };
</script>

<style>
  .container {
    background-color: #ecf6f7;
    min-height: 100vh;
    width: 100% !important;
    margin: 0;
    max-width: 100%;
  }

  input,
  textarea {
    @apply appearance-none border rounded py-4 px-3 text-gray-700 leading-tight;
  }

  label {
    margin-bottom: 8px;
  }

  div {
    position: relative;
  }
  .icon {
    position: absolute;
    pointer-events: none;
    right: 15px;
    top: 15px;
    font-size: 20px;
    color: #6ed8e0;
  }

  @media only screen and (max-width: 1024px) {
    .container {
      background: none;
      margin-bottom: 200px;
    }
  }
</style>

<div class="container mx-auto py-20">
  {#if form}
    <div
      class="mb-4 w-full xl:w-1/2 md:shadow rounded-xl md:p-10 m-auto lg:flex-row bg-white">
      <a class="block mb-6 text-midblue" href={`/user/${$user.id}`}><i
          class="fas fa-chevron-left mr-3" />Back</a>
      <h2 class="mb-10">Become an artist</h2>
      <p>
        We currently work with a limited number of artists, so we might take
        some time to review your work and get back to you. But you are welcome
        to submit your profile and apply to become an artist.
      </p>
      <div class="flex mt-4 m-auto flex-col-reverse lg:flex-row">
        <form
          class="mb-6 flex-grow xl:mr-8"
          on:submit|preventDefault={submit}
          autocomplete="off">
          <div class="flex flex-col mb-4">
            <input
              placeholder="What's your name?"
              bind:value={form.full_name} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="far fa-envelope icon" />
            <input placeholder="Your email" bind:value={form.email} />
          </div>
          <div class="flex flex-col mb-4">
            <input
              placeholder="http://example.com"
              bind:value={form.username} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fas fa-map-marker-alt icon" />
            <input placeholder="@instagram" bind:value={form.location} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fas fa-link icon" />
            <input placeholder="@twitter" bind:value={form.website} />
          </div>
          <div class="flex flex-col mb-4">
            <label>Extra information</label>
            <textarea placeholder="" bind:value={form.info} />
          </div>
          <div class="flex justify-end mt-8">
            <button on:click|preventDefault={submit} class="primary-btn ">Save
              details</button>
          </div>
        </form>
        {#if percent}
          <div class="ml-2 flex-1 flex">
            <div class="mx-auto">
              {type}
              {#if type.includes('image')}
                <img alt="preview" src={url} class="w-full" />
                {:else}
              <video
                preload="metadata"
                controls
                class:hidden
                muted
                loop
                class="w-full"
                bind:this={video}>
                Your browser does not support HTML5 video.
              </video>
              {/if}
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
          <Dropzone on:file={uploadFile} title="Upload Artwork Samples" />
        {/if}
      </div>
    </div>
  {/if}
</div>
