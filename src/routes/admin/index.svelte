<script>
  import { mutation, operationStore, subscription } from "@urql/svelte";
  import { getUsers, updateUser } from "$queries/users";
  import { role } from "$lib/store";
  import { api } from "$lib/api";

  let users = [];
  subscription(operationStore(getUsers), (a, b) => {
    users = b.users.sort((a, b) => a.username.localeCompare(b.username));
  });

  let updateUser$ = mutation(updateUser);
  let makeArtist = (user) => {
    $role = "approver";
    user.is_artist = true;
    updateUser$({ id: user.id, user: { is_artist: true } });
    api.url("/approve").post({ username: user.username });
    $role = "user";
    users = users;
  };
</script>

<div class="container mx-auto mt-20">
  <h2 class="mb-10 md:mb-0">Admin</h2>
  {#each users as user}
    <div class="flex w-full justify-center mb-2">
      <div class="w-1/6 text-center my-auto mr-2">{user.username}</div>
      <div class="w-1/3">
        {#if !user.is_artist}
          <button class="primary-btn" on:click={() => makeArtist(user)}>Make
            Artist</button>
        {/if}
      </div>
    </div>
  {/each}
</div>
