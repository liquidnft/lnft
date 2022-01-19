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
      const applicantsRequest = await hasura
        .auth(`Bearer ${$token}`)
        .headers({
          "X-Hasura-Role": "approver",
        })
        .post({
          query: getSamples,
        })
        .json();
      users = applicantsRequest.data.users.sort(
        (a, b) => a.username && a.username.localeCompare(b.username)
      );
    }
  });

  $: pageChange($page, $user);

  let pageChange = async () => {
    try {
      if (!$user) return;
      if (!$user.is_admin) goto("/market");
      $role = "approver";
    } catch (error) {
      err(error);
    }
    await requireLogin();
  };

  onDestroy(() => ($role = "user"));

  let makeArtist = async (user) => {
    user.is_artist = true;
    query(
      updateUser,
      { id: user.id, user: { is_artist: true } },
      {
        "X-Hasura-Role": "approver",
      }
    ).catch(err);

    await api
      .url("/mail-artist-application-approved")
      .auth(`Bearer ${$token}`)
      .post({
        userId: user.id,
      });

    users = users.filter((u) => u.id !== user.id);
    info(`${user.username} is now an artist!`);
  };

  let denyArtist = async (user) => {
    user.is_denied = true;
    query(
      updateUser,
      { id: user.id, user: { is_denied: true } },
      {
        "X-Hasura-Role": "approver",
      }
    ).catch(err);

    await api
      .auth(`Bearer ${$token}`)
      .url("/mail-artist-application-denied")
      .post({
        userId: user.id,
      })
      .json();

    users = users.filter((u) => u.id !== user.id);
    info(`${user.username} has been denied!`);
  };
</script>

<div class="container mx-auto mt-20">
  <h2 class="mb-10">Artist Applicants</h2>
  {#each users as user}
    <div class="flex w-full mb-8">
      <div class="flex-grow mb-auto mr-2 mt-2">
        <div class="mb-2">
          <h4><span class="font-bold">Username: </span>{user.username}</h4>
        </div>

        <div class="mb-2">
          <h4><span class="font-bold">Info: </span>{user.info}</h4>
        </div>

        <h4><span class="font-bold">Artwork samples: </span></h4>
        <div class="text-center my-auto mr-2 flex">
          {#each user.samples as sample}
            <div class="w-40 mb-2 mr-2">
              <a href={`https://ipfs.io/ipfs/${sample.url}`}>
                <ArtworkMedia
                  artwork={{ filename: sample.url, filetype: sample.type }}
                />
              </a>
            </div>
          {/each}
        </div>
      </div>

      <div class="text-center">
        <button class="primary-btn mt-4" on:click={() => makeArtist(user)}
          >Approve</button
        >
        <button class="primary-btn mt-4" on:click={() => denyArtist(user)}
          >Deny</button
        >
      </div>
    </div>
    <hr>
  {/each}
</div>
