<script>
  import { onMount } from "svelte";
  import { snack, user, token } from "$lib/store";
  import { goto }  from "$lib/utils";
  import { Avatar } from "$components/index";
  import upload from "$lib/upload";
  import { update } from "$queries/users";
  import { mutation, subscription } from "@urql/svelte";

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

      form.avatar_url = "/api/storage/o/public/" + file.name;
    }

    updateUser(form);
  };
  let pick = (obj, ...keys) =>
    Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    );
  let updateUser$ = mutation(update);
  let updateUser = (form) => {
    let {num_followers, num_follows, followed, id, balance, ...user} = form;
    updateUser$({ user, id }).then((r) => {
      $snack = "Profile updated";
      goto(`/user/${id}`);
    });
  };

  let form;
  let initialize = (user) => {
    if (!(form && form.id) && user) form = { ...user };
  };
  $: initialize($user);
</script>

{#if form}
  <h1 class="title">Edit Profile</h1>
  <div class="flex mb-4 w-2/4 shadow p-6 m-auto">
    <form
      class="mb-6 flex-grow mr-8"
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
          class="block bg-gray-800 rounded text-white px-4 py-2 rounded brand-color">Save</button>
      </div>
    </form>
    <div class="text-center" on:click={() => fileInput.click()}>
      <Avatar size="xl" src={preview || $user.avatar_url} />
      <button
        class="mt-4 rounded-full border-radius-100 bg-gray-800 text-white p-4 brand-color">Change
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
