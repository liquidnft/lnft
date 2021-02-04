<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import { info, goto, sanitize } from "$lib/utils";
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

      form.avatar_url = `/api/storage/o/public/${sanitize(file.name)}`;
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

<div class="container mx-auto px-8">
{#if form}
  <h1 class="primary-color title">Edit Profile</h1>
  <div class="flex mb-4 w-full xl:w-2/3 shadow p-8 m-auto flex-col-reverse sm:flex-row">
    <form
      class="mb-6 flex-grow sm:mr-8"
      on:submit|preventDefault={submit}
      autocomplete="off">
      <div class="flex flex-col mb-4">
        <input placeholder="Full Name" bind:value={form.full_name} />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Username" bind:value={form.username} />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Email" bind:value={form.email} />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Location" bind:value={form.location} />
      </div>
      <div class="flex flex-col mb-4">
        <input placeholder="Website" bind:value={form.website} />
      </div>
      <div class="flex flex-col mb-4">
        <textarea placeholder="Bio" bind:value={form.bio} />
      </div>
      <div class="flex">
        <button
          on:click|preventDefault={submit}
          class="brand-color">Save</button>
      </div>
    </form>
    <div class="text-center mx-auto" on:click={() => fileInput.click()}>
      <Avatar size="xl" src={preview || $user.avatar_url} />
      <button
        class="my-6 brand-color">Change
        Avatar</button>

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
{/if}
</div>
