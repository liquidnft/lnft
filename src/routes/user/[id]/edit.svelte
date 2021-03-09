<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { err, info, goto, validateEmail } from "$lib/utils";
  import { Avatar } from "$components/index";
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

    if (form.email && !validateEmail(form.email))
      return err("Invalid email");

    if (form.twitter) form.twitter = form.twitter.replace(/@/g, "");
    if (form.instagram) form.instagram = form.instagram.replace(/@/g, "");
    if (form.website) form.website = form.website.replace(/.*:\/\//, "");

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
      pubkey,
      ...user
    } = form;
    updateUser$({ user, id }).then((r) => {
      info("Profile updated");
      goto(`/${user.username}`);
    });
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
  {#if form}
    <div
      class="mb-4 w-full sm:max-w-3xl md:shadow rounded-xl md:p-10 m-auto lg:flex-row  bg-white">
      <a class="block mb-6 text-midblue" href={`/${$user.username}`}><i
          class="fas fa-chevron-left mr-3" />Back</a>
      <h2 class="mb-10">Edit Profile</h2>
      <div class="flex mt-4 m-auto flex-col-reverse lg:flex-row">
        <form
          class="mb-6 flex-grow xl:mr-8"
          on:submit|preventDefault={submit}
          autocomplete="off">
          <div class="flex flex-col mb-4">
            <label>Name</label>
            <input placeholder="Full Name" bind:value={form.full_name} />
          </div>
          <div class="flex flex-col mb-4">
            <label>Username</label>
            <input placeholder="Username" bind:value={form.username} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="far fa-envelope icon" />
            <input placeholder="email@example.com" bind:value={form.email} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fab fa-twitter icon" />
            <input placeholder="@twitter" bind:value={form.twitter} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fab fa-instagram icon" />
            <input placeholder="@instagram" bind:value={form.instagram} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fas fa-map-marker-alt icon" />
            <input placeholder="Vancouver, Canada" bind:value={form.location} />
          </div>
          <div class="flex flex-col mb-4">
            <i class="fas fa-link icon" />
            <input placeholder="example.com" bind:value={form.website} />
          </div>
          <div class="flex flex-col mb-4">
            <label>Bio</label>
            <textarea placeholder="" bind:value={form.bio} />
          </div>
          <div class="flex mt-8">
            <button on:click|preventDefault={submit} class="primary-btn ">Save
              details</button>
          </div>
        </form>
        <div
          class="text-center mx-auto lg:ml-10 mb-10"
          on:click={() => fileInput.click()}>
          <Avatar size="xl" src={preview || $user.avatar_url} />
          <button class="text-lightblue mt-5">CHANGE AVATAR
            <i class="far fa-image ml-2" /></button>

          <input
            class="hidden"
            bind:this={fileInput}
            type="file"
            id="fileElem"
            multiple
            accept="image/*"
            on:change={fileChosen} />
        </div>
      </div>
    </div>
  {/if}
</div>
