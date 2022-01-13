<script>
  import Fa from "svelte-fa";
  import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
  import {
    faEnvelope,
    faChevronLeft,
    faLink,
    faMapMarkerAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount, tick } from "svelte";
  import { user, token } from "$lib/store";
  import { err, info, goto } from "$lib/utils";
  import { Avatar, Dropzone, ProgressLinear } from "$comp";
  import { upload } from "$lib/upload";
  import { updateUser } from "$queries/users";
  import { query } from "$lib/api";

  let form = {};
  let fileInput;
  let preview;
  let file;
  let percent;
  let url;
  let hidden;

  let files = [];

  onMount(() => {
    ({ ...form } = $user);
  });

  $: width = `width: ${percent}%`;

  const uploadFile = async ({ detail: file }) => {
    percent = 0;
    if (!file) return;

    if (file.size < 100000000) previewFile(file);

    let hash = await upload(file, progress);
    let url = preview || `/api/ipfs/${hash}`;
    url += "#t=0.5";

    files = [
      ...files,
      {
        type: file.type,
        filename: file.name,
        hash,
        url,
      },
    ];

    await tick();
    if (file.type.includes("video")) {
      let source = document.createElement("source");
      source.setAttribute("src", url);
      file.video.appendChild(source);
      file.video.load();
    }
  };

  let previewFile = (file) => {
    var reader = new FileReader();

    reader.onload = async (e) => {
      preview = e.target.result;
      await tick();
      if (file.type.includes("video")) preview = URL.createObjectURL(file);
    };

    reader.readAsDataURL(file);
  };

  let progress = (event) => {
    percent = Math.round((event.loaded / event.total) * 100);
  };

  let insertSamples = `mutation ($samples: [samples_insert_input!]!) {
    insert_samples(objects: $samples) {
      affected_rows
    }
  }`;

  let submitted;
  let submit = async () => {
    let {
      id,
      is_artist,
      is_admin,
      num_followers,
      num_follows,
      followed,
      balance,
      pubkey,
      wallet_initialized,
      ...rest
    } = form;

    await query(updateUser, { user: rest, id }).catch(err);

    let samples = files.map((f) => ({
      user_id: id,
      url: f.hash,
      type: f.type,
    }));

    await query(insertSamples, { samples }).catch(err);

    submitted = true;
  };

</script>

<style>
  .container {
    background-color: #ecf6f7;
    height: auto;
    min-height: 100vh;
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
  {#if form && $user}
    <div
      class="mb-4 w-full max-w-5xl md:shadow rounded-xl md:p-10 m-auto lg:flex-row bg-white">
      <a class="block mb-6 text-midblue" href={`/${$user.username}`}>
        <div class="flex">
          <Fa icon={faChevronLeft} class="my-auto mr-1" />
          <div>Back</div>
        </div>
      </a>
      <h2 class="mb-10">Become an artist</h2>
      {#if submitted}
        <div>
          Thank you! Your application has been recorded. We'll follow up by
          email once we've had a chance to review it.
        </div>
      {:else}
        <p>
          We currently work with a limited number of artists, so we might take
          some time to review your work and get back to you. But you are welcome
          to submit your profile and apply to become an artist.
        </p>
        <div class="flex mt-4 m-auto flex-col-reverse lg:flex-row">
          <form
            class="mb-6 w-full lg:max-w-md xl:mr-8"
            on:submit|preventDefault={submit}
            autocomplete="off">
            <div class="flex flex-col mb-4">
              <input
                class="name-input"
                placeholder="What's your name?"
                bind:value={form.full_name} />
            </div>
            <div class="flex flex-col mb-4">
              <i class="icon">
                <Fa icon={faEnvelope} class="mt-1" />
              </i>
              <input placeholder="email@example.com" bind:value={form.email} />
            </div>
            <div class="flex flex-col mb-4">
              <i class="icon">
                <Fa icon={faTwitter} class="mt-1" />
              </i>
              <input placeholder="@twitter" bind:value={form.twitter} />
            </div>
            <div class="flex flex-col mb-4">
              <i class="icon">
                <Fa icon={faInstagram} class="mt-1" />
              </i>
              <input placeholder="@instagram" bind:value={form.instagram} />
            </div>
            <div class="flex flex-col mb-4">
              <i class="icon">
                <Fa icon={faMapMarkerAlt} class="mt-1" />
              </i>
              <input
                placeholder="Vancouver, Canada"
                bind:value={form.location} />
            </div>
            <div class="flex flex-col mb-4">
              <i class="icon">
                <Fa icon={faLink} class="mt-1" />
              </i>
              <input placeholder="example.com" bind:value={form.website} />
            </div>
            <div class="flex flex-col mb-4">
              <label for="info">Extra information</label>
              <textarea id="info" placeholder="" bind:value={form.info} />
            </div>
            <div class="flex justify-end mt-8">
              <button
                on:click|preventDefault={submit}
                class="primary-btn">Submit profile</button>
            </div>
          </form>
          <div class="mb-10 w-full sm:w-1/2">
            {#each files as file}
              <div class="ml-2 flex mb-2">
                <div>
                  {#if file.type.includes('image')}
                    <img alt="preview" src={file.url} class="w-20" />
                  {:else}
                    <video
                      preload="metadata"
                      controls
                      class:hidden
                      muted
                      loop
                      class="w-20"
                      bind:this={file.video}>
                      Your browser does not support HTML5 video.
                    </video>
                  {/if}
                </div>
                <div class="ml-2 mt-auto">{file.filename}</div>
              </div>
            {/each}

            <Dropzone
              on:file={uploadFile}
              title={files.length < 1 ? 'Upload artwork samples' : 'Add artwork samples'}
              style={files.length < 1 ? 'box' : 'link'} />
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
