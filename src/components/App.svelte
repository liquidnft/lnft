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
  import { InsufficientFunds } from "$comp";
  import { etag, publicPages, err, info, goto } from "$lib/utils";
  import { createWallet } from "$lib/wallet";
  import { browser } from "$app/env";

  onMount(async () => {
    await ready();
    //refreshToken();
    //setInterval(refreshToken, 60000);
  });

  const ready = () =>

    new Promise((r) =>
      (function wait() {
        if (!browser || typeof Buffer !== "undefined") return r();
        setTimeout(wait, 30);
      })()
    );

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

    if ($user && !$user.wallet_initialized && !p.path.includes("create"))
      goto("/wallet/create");
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

<div in:fade>
  <slot />
</div>
