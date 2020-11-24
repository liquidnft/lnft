<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";
  import Avatar from "$components/Avatar";
  import Success from "$components/Success";
  import upload from "$lib/upload";
  import { update } from "$queries/users";
  import { mutation, subscription } from "@urql/svelte";

  let success;
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

  let updateUser$ = mutation(update);
  let updateUser = async (user) => {
    updateUser$({ user }).then(() => {
      success = true;
    });
  };

  let form;
  let initialize = (user) => {
    if (!(form && form.id) && user) form = { ...user };
  };
  $: initialize($user);
</script>

{#if form}
  <div class="flex mb-4 w-3/4 shadow p-6">
    <form
      class="mb-6 flex-grow mr-8"
      on:submit|preventDefault={submit}
      autocomplete="off">
      {#if success}
        <Success message="Profile updated" />
      {/if}
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
          class="block bg-gray-800 rounded text-white px-4 py-2 rounded">Save</button>
      </div>
    </form>
    <div class="text-center" on:click={() => fileInput.click()}>
      <Avatar size="xl" src={preview || `${$user.avatar_url}`} />
      <button
        class="mt-4 rounded-full border-radius-100 bg-gray-800 text-white p-4">Change
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
