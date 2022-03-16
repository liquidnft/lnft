<script context="module">
  export async function load({ session }) {
    if (!(session && session.user && session.user.is_admin))
      return {
        status: 302,
        redirect: "/",
      };

    return {};
  }
</script>

<script>
  import { session } from "$app/stores";
  import { onMount, tick, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { ArtworkMedia } from "$comp";
  import { getSamples, updateUser, deleteSamples } from "$queries/users";
  import { api, hasura, query } from "$lib/api";
  import { err, info } from "$lib/utils";
  import { requireLogin } from "$lib/auth";

  let users = [];
  let samples;

  onMount(async () => {
    if ($session.jwt) {
      const applicantsRequest = await hasura
        .auth(`Bearer ${$session.jwt}`)
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

  let makeArtist = async (user) => {
    try {
      user.is_artist = true;
      await query(
        updateUser,
        { id: user.id, user: { is_artist: true, info: null } },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await query(
        deleteSamples,
        { user_id: user.id },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await api
        .url("/mail-artist-application-approved")
        .auth(`Bearer ${$session.jwt}`)
        .post({
          userId: user.id,
        });

      users = users.filter((u) => u.id !== user.id);
      info(`${user.username} is now an artist!`);
    } catch (error) {
      err(error);
    }
  };

  let denyArtist = async (user) => {
    try {
      await query(
        updateUser,
        { id: user.id, user: { info: null } },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await query(
        deleteSamples,
        { user_id: user.id },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await api
        .auth(`Bearer ${$session.jwt}`)
        .url("/mail-artist-application-denied")
        .post({
          userId: user.id,
        });

      users = users.filter((u) => u.id !== user.id);
      info(`${user.username} has been denied!`);
    } catch (error) {
      err(error);
    }
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
          <h4><span class="font-bold">Email: </span>{user.display_name}</h4>
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
    <hr />
  {/each}
</div>
