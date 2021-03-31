<script>
  import { api, hasura } from "$lib/api";
  import { onMount } from "svelte";
  import decode from "jwt-decode";
  import {
    artworks,
    error,
    poll,
    prompt,
    results,
    role,
    snack,
    token,
    user,
    users,
  } from "$lib/store";
  import { fade } from "svelte/transition";
  import { getUser, getUsersAddresses, updateUser } from "$queries/users";
  import { getArtworks } from "$queries/artworks";
  import { setupUrql } from "$lib/urql";
  import { query, operationStore } from "@urql/svelte";
  import { page } from "$app/stores";
  import { requireLogin, refreshToken } from "$lib/auth";
  import InsufficientFunds from "$components/InsufficientFunds";
  import { etag, publicPages } from "$lib/utils";

  onMount(async () => {
    refreshToken();
    setInterval(refreshToken, 600000);
  });

  $: if ($error && $error.message && $error.message.includes("Insufficient")) {
    $prompt = InsufficientFunds;
  }

  let lastPage;
  let pageChange = (p) => {
    if (!publicPages.includes(p.path.replace(/\?.*/, ""))) requireLogin();
    if (lastPage === "/market") $results = [];
    $poll.map((p) => clearInterval(p.interval));
    lastPage = p.path;
    $error = null;
    $snack = null;
  };

  $: pageChange($page);

  let id, initialized;

  setupUrql();
  $: setup($role, $token);

  let o = { requestPolicy: "cache-and-network" };
  query(operationStore(getArtworks), {}, o).subscribe(({ data }) => {
    if (data) {
      $artworks = data.artworks;
    }
  });

  query(operationStore(getUsersAddresses), {}, o).subscribe(({ data }) => {
    if (data) {
      $users = data.users;
    }
  });

  let userQuery = operationStore(getUser);
  $: if ($token) query(userQuery, {}, o).subscribe(({ data }) => {
    if (data && data.currentuser) {
      $user = data.currentuser[0];
    }
  });

  let setup = (r, t) => {
    if (t && !initialized) {
      id = decode(t)["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      setupUrql(t);
      if ($userQuery) {
        $userQuery.context = { requestPolicy: "cache-and-network" };
      } 

      initialized = true;
    }
  };
</script>

<div in:fade>
  <slot />
</div>
