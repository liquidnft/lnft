<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { info, goto } from "$lib/utils";
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

  let checkProgress = (resolve) => {
    if (percent === 100) resolve();
    else setTimeout(() => checkProgress(resolve), 500);
  };

  let submit = async () => {
    if (file) {
      upload(file, $token, progress);
      await new Promise(checkProgress);

      form.avatar_url = `/api/ipfs/${file.name}`;
    }

    update(form);
  };

  let updateUser$ = mutation(updateUser);

  let update = (form) => {
    let { num_followers, num_follows, followed, id, balance, ...user } = form;
    updateUser$({ user, id }).then((r) => {
      info("Profile updated");
      goto(`/user/${id}`);
    });
  };
</script>

<style>

  .container{
    background-color:#ECF6F7;
    height: 100vh;
    width: 100% !important;
    margin: 0;
    max-width: 100%;
  }

  input, textarea {
    @apply appearance-none border rounded py-4 px-3 text-gray-700 leading-tight;
  }
  
  label{ margin-bottom: 8px;}

  div{
    position: relative;
  }
  .icon{
    position: absolute;
    pointer-events: none;
    right: 15px;
    top: 15px;
    font-size: 20px;
    color: #6ED8E0; 
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
  <div class="mb-4 w-full xl:w-1/2 md:shadow rounded-xl md:p-10 m-auto lg:flex-row bg-white">
    <a class="block mb-6 text-midblue" href="/"><i class="fas fa-chevron-left mr-3"></i>Back</a>
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
          <i class="far fa-envelope icon"></i>
          <input placeholder="Email" bind:value={form.email} />
        </div>
        <div class="flex flex-col mb-4">
          <i class="fas fa-map-marker-alt icon"></i>
          <input placeholder="Vancouver, Canada" bind:value={form.location} />
        </div>
        <div class="flex flex-col mb-4">
          <i class="fas fa-link icon"></i>
          <input placeholder="http://example.com" bind:value={form.website} />
        </div>
        <div class="flex flex-col mb-4">
          <label>Bio</label>
          <textarea placeholder="" bind:value={form.bio} />
        </div>
        <div class="flex justify-end mt-8">
          <button
            on:click|preventDefault={submit}
            class="primary-btn ">Save details</button>
        </div>
      </form>
      <div class="text-center mx-auto lg:ml-10 mb-10" on:click={() => fileInput.click()}>
        <Avatar size="xl" src={preview || $user.avatar_url} />
        <button
          class="text-lightblue mt-5">CHANGE AVATAR <i class="far fa-image ml-2"></i></button>

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
