<script>
  import { onMount } from "svelte";
  import { user, token } from "$lib/store";
  import goto from "$lib/goto";
  import Avatar from "$components/Avatar";
  import { getUser, updateUser } from "$queries/users";
  import Success from "$components/Success";

  let success;

  let submit = async () => {
    $user = await updateUser($token, form);
    success = true;
  };

  let form;

  onMount(async () => {
    form = await getUser($token);
  });
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
    <div class="text-center">
      <Avatar size="xl" />
      <button
        class="mt-4 rounded-full border-radius-100 bg-gray-800 text-white p-4">Change
        Avatar</button>
    </div>
  </div>
{/if}
