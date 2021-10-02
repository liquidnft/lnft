<script>
  import { onMount, tick, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { ArtworkMedia } from "$comp";
  import { getSamples, updateUser } from "$queries/users";
  import { role, user, token } from "$lib/store";
  import { api, hasura, query } from "$lib/api";
  import { err, goto, info } from "$lib/utils";
  import { requireLogin } from "$lib/auth";

  let users = [];
  let samples;

  onMount(async () => {
    if ($token) {
      users = (
        await hasura
          .auth(`Bearer ${$token}`)
          .headers({
            "X-Hasura-Role": "approver",
          })
          .post({
            query: getSamples,
          })
          .json()
      ).data.users.sort(
        (a, b) => a.username && a.username.localeCompare(b.username)
      );
    }
  });

  $: pageChange($page, $user);
  let pageChange = async () => {
    await requireLogin();
    if (!$user) return;
    if (!$user.is_admin) goto("/market");
    $role = "approver";
  };

  onDestroy(() => ($role = "user"));

  let makeArtist = (user) => {
    user.is_artist = true;
    query(updateUser, { id: user.id, user: { is_artist: true } }).catch(err);
    users = users.filter((u) => u.id !== user.id);
    info(`${user.username} is now an artist!`);
  };

</script>

<div class="container mx-auto mt-20">
  <h2 class="mb-10">Artist Applicants</h2>
  {#each users as user}
    <div class="flex w-full mb-8">
      <div class="flex-grow mb-auto mr-2">
        <div class="mb-2">
          <h4>Username</h4>
          <div>{user.username}</div>
        </div>

        <div class="mb-2">
          <h4>Info</h4>
          <div>{user.info}</div>
        </div>

        <h4>Artwork samples</h4>
        <div class="text-center my-auto mr-2 flex">
          {#each user.samples as sample}
            <div class="w-40 mb-2 mr-2">
              <a href={`https://ipfs.io/ipfs/${sample.url}`}>
                <ArtworkMedia
                  artwork={{ filename: sample.url, filetype: sample.type }} />
              </a>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <button
          class="primary-btn"
          on:click={() => makeArtist(user)}>Approve</button>
      </div>
    </div>
  {/each}
</div>
