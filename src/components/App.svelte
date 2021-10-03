<script>
  import { api, query } from "$lib/api";
  import { onMount, tick } from "svelte";
  import decode from "jwt-decode";
  import {
    addresses,
    error,
    loggedIn,
    poll,
    prompt,
    results,
    role,
    snack,
    titles,
    token,
    user,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { getTitles } from "$queries/artworks";
  import { getUser, getUsersAddresses } from "$queries/users";
  import { page } from "$app/stores";
  import { refreshToken } from "$lib/auth";
  import { InsufficientFunds, Session } from "$comp";
  import { etag, publicPages, err, info } from "$lib/utils";
  import { createWallet } from "$lib/wallet";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 60000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient")) {
    $prompt = InsufficientFunds;
  }

  let lastPage;
  let pageChange = (p) => {
    if (lastPage === "/market") $results = [];
    $poll.map((p) => clearInterval(p.interval));
    lastPage = p.path;
    $error = null;
    $snack = null;
  };

  $: pageChange($page);

  let id;

  $: setup($role, $token);

  let setup = async (r, t) => {
    if (t) {
      if (!$loggedIn) {
        id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
        $loggedIn = true;
      }
    }

    query(getUsersAddresses)
      .then((res) => ($addresses = res.users))
      .catch(err);

    query(getTitles)
      .then((res) => ($titles = res.artworks))
      .catch(err);
  };

</script>

{#if $loggedIn}
  <Session />
{/if}

<div in:fade>
  <slot />
</div>
